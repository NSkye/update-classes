import { ensureArray } from '../utils';

export const afterEvent = (
  eventName,
  targets,
  classes,
  updateClasses,
) => {
  const targetsArray = ensureArray(targets);

  const updateOnEvent = ({ target }) => {
    updateClasses(target, classes);
    target.removeEventListener(eventName, updateOnEvent);
  };

  targetsArray.forEach(target => target.addEventListener(eventName, updateOnEvent));
};
