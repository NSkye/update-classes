export const convertStringNotationToObject = classesString => classesString
  .split(' ')
  .reduce((classesObject, cssClass) => {
    // Detect class remove
    if (cssClass[0] === '!') {
      classesObject[cssClass.substring(1)] = false;
      return classesObject;
    }

    // Detect class toggle
    if (cssClass[0] === '~') {
      classesObject[cssClass.substring(1)] = '~toggle';
      return classesObject;
    }

    // Detect class replace
    const cssClasses = cssClass
      .split('->')
      .filter(Boolean);

    if (cssClasses.length > 1) {
      classesObject[cssClasses[0]] = cssClasses[cssClasses.length - 1];
      return classesObject;
    }

    // Add class
    classesObject[cssClass] = true;
    return classesObject;
  }, {});
