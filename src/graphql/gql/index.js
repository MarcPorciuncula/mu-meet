// Babel plugin that strips the gql template tag

module.exports = ({ types: t }) => {
  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        if (path.node.tag.name !== 'gql') {
          return;
        }
        path.replaceWith(path.node.quasi);
      },
    },
  };
};
