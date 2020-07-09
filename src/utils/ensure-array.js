export const ensureArray = value => (Array.isArray(value)
  ? value
  : [ value ]);
