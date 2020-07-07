import { convertStringNotationToObject, flatten } from '../utils';

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

export const processClasses = (classes = [], ensureClasses = [], scope = '') => flatten(classes)
  .map(copyClasses)
  .concat(flatten(ensureClasses).map(copyClasses))
  .map(scopeClasses(scope));
