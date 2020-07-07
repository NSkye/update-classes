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

export const processClasses = (classes = [], ensureClasses = [], scope = '') => {
  const allClasses = ensureArray(classes).concat(ensureArray(ensureClasses));
  return flatten(allClasses).map(scopeClasses(scope));
};
