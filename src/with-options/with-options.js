import { ensureArray } from '../utils';
import { afterEvent } from './after-event';
import { processClasses } from './classes-helpers';
import {
  createOptions,
  copyOptions,
  mergeOptions,
} from './options-helpers';

export const withOptions = (updateClassesFunction, options) => {
  const updateClassesOriginal = updateClassesFunction.__extractOriginal
    ? updateClassesFunction.__extractOriginal()
    : updateClassesFunction;

  const previousOptions = options || createOptions();

  const currentOptions = updateClassesFunction.__extractOptions
    ? mergeOptions(updateClassesFunction.__extractOptions(), previousOptions)
    : previousOptions;

  const updateClassesWithOptions = (targets, classes, ignoreScope = false) => {
    const currentScope = !ignoreScope
      ? currentOptions.scope
      : '';

    const currentTargets = ensureArray(targets || [])
      .concat(currentOptions.ensureTargets);

    const currentClasses = processClasses(
      classes || [],
      currentOptions.ensureClasses,
      currentScope,
    );

    updateClassesOriginal(currentTargets, currentClasses);
    return {
      and: updateClassesWithOptions,
      also: updateClassesWithOptions,
      afterTransition: (additionalClasses, shouldIgnoreScope = false) => afterEvent(
        'transitionend',
        currentTargets,
        processClasses(
          additionalClasses,
          currentOptions.ensureClasses,
          shouldIgnoreScope ? '' : currentOptions.scope,
        ),
        updateClassesOriginal,
      ),
      afterAnimation: (additionalClasses, shouldIgnoreScope = false) => afterEvent(
        'animationend',
        currentTargets,
        processClasses(
          additionalClasses,
          currentOptions.ensureClasses,
          shouldIgnoreScope ? '' : currentOptions.scope,
        ),
        updateClassesOriginal,
      ),
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
