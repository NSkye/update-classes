import { convertStringNotationToObject, flatten, ensureArray } from '../utils';

export const copyClasses = classes => (
  typeof classes === 'object'
    ? { ...classes }
    : classes
);

export const scopeClasses = scope => classes => Object.entries(
  typeof classes === 'string'
    ? convertStringNotationToObject(classes)
    : classes,
).reduce((scopedClasses, [ className, action ]) => {
  scopedClasses[String(scope) + String(className)] = action;
  return scopedClasses;
}, {});

export const flattenClasses = classes => {
  let hadFunctions = false;

  const flattenedClasses = flatten(classes)
    .map(classCombination => {
      if (typeof classCombination === 'function') {
        hadFunctions = true;
        return classCombination();
      }
      return classCombination;
    });

  return hadFunctions
    ? flattenClasses(flattenedClasses)
    : flattenedClasses;
};

export const processClasses = (classes = [], ensureClasses = [], scope = '') => {
  const allClasses = ensureArray(classes).concat(ensureArray(ensureClasses));
  return flattenClasses(allClasses).map(scopeClasses(scope));
};
