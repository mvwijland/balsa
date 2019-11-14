const getAnchorMark = anchor => {
  const nodeBefore = anchor.nodeBefore;
  const nodeAfter = anchor.nodeAfter;

  if (nodeBefore) {
    for (const mark of nodeBefore.marks) {
      if (mark.type.name === 'comment') {
        return mark;
      }
    }
  }

  if (nodeAfter) {
    for (const mark of nodeAfter.marks) {
      if (mark.type.name === 'comment') {
        return mark;
      }
    }
  }

  return null;
};

const checkMark = step => {
  const mark = step.mark;
  return mark && mark.type.name === 'comment';
};

export const getHandsonTableStep = transaction => {
  for (const step of transaction.steps) {
    if (checkMark(step)) {
      return step;
    }
  }
  return null;
};
