// @flow
import { visit, GraphQLNonNull, GraphQLObjectType, GraphQLList } from 'graphql';
import {
  LeafLiveQuery,
  ObjectLiveQuery,
  ListLiveQuery,
  RedirectLiveQuery,
} from './FirebaseLiveQuery';
import type { Reference } from 'firebase/database';
import type Observable from './Observable';

// TODO support vars properly
export default function execute(
  schema: any,
  doc: any,
  rootRef: Reference,
  context: any = {},
  vars: { [key: string]: any } = {},
): Observable<any> {
  Object.assign(context, { isSubscription: true, root: rootRef });

  const ast = visit(doc, {
    Field: {
      enter(node, key, parent, path, ancestors) {
        // Find the schema field for the current Field

        const parentField = ancestors[ancestors.length - 2];
        const parentFieldType = unwrapNonNullType(parentField.__field.type);

        node.__field = parentFieldType.getFields()[node.name.value];
      },
      leave(node, key, parent, path, ancestors) {
        // Make a subscription factory for the current Field
        // TODO behaviour is not defined for 2+ dimensional lists

        const type = node.__field.type;
        const isListType = unwrapNonNullType(type) instanceof GraphQLList;
        const innerType = unwrapNonNullType(
          unwrapListType(unwrapNonNullType(type)),
        );
        const args = {};
        node.arguments.forEach(
          argument => (args[argument.name.value] = argument.value.value),
        );
        let getInnerSubscription;

        if (innerType instanceof GraphQLObjectType) {
          getInnerSubscription = ref => {
            const children = {};
            node.selectionSet.selections.forEach(field => {
              children[field.name.value] = field.__getSubscription(ref);
            });
            return new ObjectLiveQuery(ref, children);
          };
        } else {
          getInnerSubscription = ref => {
            return new LeafLiveQuery(ref, innerType._scalarConfig.serialize);
          };
        }

        let getSubscription;
        if (isListType) {
          getSubscription = parentRef => {
            const ref = node.__field.resolve(parentRef, args, context);
            return new ListLiveQuery(ref, getInnerSubscription);
          };
        } else {
          getSubscription = parentRef => {
            const ref = node.__field.resolve(parentRef, args, context);
            if (typeof ref.target === 'function') {
              // this is a redirect
              return new RedirectLiveQuery(ref.source, (_ref, value) => {
                return getInnerSubscription(ref.target(value));
              });
            }
            return getInnerSubscription(ref);
          };
        }

        node.__getSubscription = getSubscription;
      },
    },
    OperationDefinition: {
      enter(node) {
        node.__field = { type: schema.getSubscriptionType() };
      },
      leave(node) {
        // The root is always an object subscription
        node.__getSubscription = rootRef => {
          const children = {};
          node.selectionSet.selections.forEach(field => {
            children[field.name.value] = field.__getSubscription(rootRef);
          });
          return new ObjectLiveQuery(rootRef, children);
        };
      },
    },
  });

  const rootLiveQuery = ast.definitions[0].__getSubscription(rootRef);
  return rootLiveQuery;
}

function unwrapNonNullType(type) {
  return type instanceof GraphQLNonNull ? type.ofType : type;
}

function unwrapListType(type) {
  return type instanceof GraphQLList ? type.ofType : type;
}
