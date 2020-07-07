import { flatten } from '../utils';
import { copyClasses } from './classes-helpers';

export const createOptions = () => ({
  scope: '',
  ensureTargets: [],
  ensureClasses: [],
});

export const copyOptions = options => ({
  scope: options.scope,
  ensureTargets: [ ...options.ensureTargets ],
  ensureClasses: flatten(options.ensureClasses)
    .map(copyClasses),
});

export const mergeOptions = (options1, options2) => ({
  scope: options1.scope + options2.scope,
  ensureTargets: options1.ensureTargets.concat(options2.ensureTargets),
  ensureClasses: ([
    ...flatten(options1.ensureClasses),
    ...flatten(options2.ensureClasses),
  ])
    .map(copyClasses),
});
