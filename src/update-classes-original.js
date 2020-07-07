import { updateClassesWithObject } from './update-classes-with-object';
import { convertStringNotationToObject, ensureArray } from './utils';

export const updateClassesOriginal = (targets, classes) => {
  const targetsArray = ensureArray(targets);

  const classesNotation = (Array.isArray(classes) && 'array') || typeof classes;

  const update = (({

    array: () => classes.forEach(
      classCombination => updateClassesOriginal(
        targetsArray,
        classCombination,
      ),
    ),

    object: () => updateClassesWithObject(
      targetsArray,
      classes,
    ),

    string: () => updateClassesWithObject(
      targetsArray,
      convertStringNotationToObject(String(classes)),
    ),

  })[classesNotation]);

  if (update) {
    update();
  }
};
