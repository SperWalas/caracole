export const getNodesOffset = (selfNode, targetNode) => {
  const fromRect = selfNode ? selfNode.getBoundingClientRect() : null;
  const toRect = targetNode ? targetNode.getBoundingClientRect() : null;

  console.log({ toRect });

  return fromRect && toRect
    ? {
        x: toRect.x + toRect.width * 0.5 - (fromRect.x + fromRect.width * 0.5), // toRect.x - toRect.width * 0.5 - fromRect.x + fromRect.width * 0.5,
        y: toRect.y + toRect.height * 0.5 - (fromRect.y + fromRect.height * 0.5),
        height: toRect.height,
        width: toRect.width
      }
    : { x: 0, y: 0, height: 0, width: 0 };
};
