export function leaf(path) {
  return (parentRef, args, context, info) => {
    const ref = parentRef.child(path);
    if (context.isSubscription) {
      return ref;
    } else {
      return ref.once('value').then(s => s.val());
    }
  };
}

export function child(path) {
  return (parentRef, args, context, info) => {
    return parentRef.child(path);
  };
}
