export const getNodesOffset = (selfNode, targetNode) => {
  const fromRect = selfNode ? selfNode.getBoundingClientRect() : null;
  const toRect = targetNode ? targetNode.getBoundingClientRect() : null;

  return fromRect && toRect
    ? { x: toRect.x - fromRect.x, y: toRect.y - fromRect.y }
    : { x: 0, y: 0 };
};
