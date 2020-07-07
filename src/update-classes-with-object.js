import { recognizeAction } from './utils';

export const updateClassesWithObject = (targets, classes) => {
  const methods = Object.entries(classes)
    .map(([ className, action ]) => recognizeAction(action, className));

  targets
    .forEach(({ classList }) => methods.forEach(({ method, args }) => classList[method](...args)));
};
