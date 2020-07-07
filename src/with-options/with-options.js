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
