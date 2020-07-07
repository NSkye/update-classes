import { ensureArray } from './ensure-array';

export const flatten = input => {
  const originalArray = ensureArray(input);
  const resultArray = [];
  const throughArray = subArray => subArray.forEach(element => {
    if (Array.isArray(element)) {
      throughArray(element);
    }
    resultArray.push(element);
  });
  throughArray(originalArray);
  return resultArray;
};
