import { updateClassesWithObject } from './update-classes-with-object';
import { convertStringNotationToObject, ensureArray } from './utils';

export const updateClassesOriginal = (targets, classes) => {
  const targetsArray = ensureArray(targets);

  const classesNotation = `${(Array.isArray(classes) && 'array') || typeof classes}Notation`;

  const update = (({

    arrayNotation: () => classes.forEach(
      classCombination => updateClassesOriginal(
        targetsArray,
        classCombination,
      ),
    ),

    objectNotation: () => updateClassesWithObject(
      targetsArray,
      classes,
    ),

    stringNotation: () => updateClassesWithObject(
      targetsArray,
      convertStringNotationToObject(String(classes)),
    ),

    functionNotation: () => updateClassesOriginal(
      targetsArray,
      classes(),
    ),

  })[classesNotation]);

  if (update) {
    update();
  }
};
