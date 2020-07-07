import {
  convertStringNotationToObject,
  ensureArray,
  flatten,
} from './utils';

const createOptions = () => ({
  scope: '',
  ensureTargets: [],
  ensureClasses: [],
});

const copyClasses = classes => (
  typeof classes === 'object'
    ? { ...classes }
    : classes
);

const scopeClasses = scope => classes => Object.entries(
  typeof classes === 'string'
    ? convertStringNotationToObject(classes)
    : classes,
).reduce((scopedClasses, [ className, action ]) => {
  scopedClasses[String(scope) + String(className)] = action;
  return scopedClasses;
}, {});

const processClasses = (classes, ensureClasses, scope) => flatten(
  ensureArray(classes)
    .concat(ensureClasses.map(copyClasses)),
).map(scopeClasses(scope));

const mergeOptions = (options1, options2) => ({
  scope: options1.scope + options2.scope,
  ensureTargets: options1.ensureTargets.concat(options2.ensureTargets),
  ensureClasses: ([
    ...flatten(options1.ensureClasses),
    ...flatten(options2.ensureClasses),
  ])
    .map(copyClasses),
});

const copyOptions = options => ({
  scope: options.scope,
  ensureTargets: [ ...options.ensureTargets ],
  ensureClasses: flatten(options.ensureClasses)
    .map(copyClasses),
});

function afterEvent(eventName, targets, classes, updateClasses) {
  const targetsArray = ensureArray(targets);

  const updateOnEvent = ({ target }) => {
    updateClasses(target, classes);
    target.removeEventListener(eventName, updateOnEvent);
  };

  targetsArray.forEach(target => target.addEventListener(eventName, updateOnEvent));
}

export const withOptions = (updateClassesFunction, options) => {
  const updateClassesOriginal = updateClassesFunction.__extractOriginal
    ? updateClassesFunction.__extractOriginal()
    : updateClassesFunction;

  const previousOptions = options || createOptions();

  const currentOptions = updateClassesFunction.__extractOptions
    ? mergeOptions(updateClassesFunction.__extractOptions(), previousOptions)
    : previousOptions;

  const updateClassesWithOptions = (targets, classes) => {
    const currentTargets = ensureArray(targets || [])
      .concat(currentOptions.ensureTargets);

    const currentClasses = processClasses(
      classes || [],
      currentOptions.ensureClasses,
      currentOptions.scope,
    );

    updateClassesOriginal(currentTargets, currentClasses);
    return {
      and: updateClassesWithOptions,
      also: updateClassesWithOptions,
      afterTransition: additionalClasses => afterEvent('transitionend', currentTargets, processClasses(
        additionalClasses,
        currentOptions.ensureClasses,
        currentOptions.scope,
      ), updateClassesOriginal),
      afterAnimation: additionalClasses => afterEvent('animationend', currentTargets, processClasses(
        additionalClasses,
        currentOptions.ensureClasses,
        currentOptions.scope,
      ), updateClassesOriginal),
    };
  };

  updateClassesWithOptions.__extractOriginal = () => updateClassesOriginal;
  updateClassesWithOptions.__extractOptions = () => copyOptions(currentOptions);

  updateClassesWithOptions.scope = scopeName => {
    const newOptions = createOptions();
    newOptions.scope = scopeName;

    return withOptions(updateClassesWithOptions, newOptions);
  };

  updateClassesWithOptions.target = target => {
    const newOptions = createOptions();
    newOptions.ensureTargets = ensureArray(target);

    return withOptions(updateClassesWithOptions, newOptions);
  };

  updateClassesWithOptions.classes = classesArray => {
    const newOptions = createOptions();
    newOptions.ensureClasses = classesArray;

    return withOptions(updateClassesWithOptions, newOptions);
  };

  return updateClassesWithOptions;
};
