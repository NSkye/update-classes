const convertStringNotationToObject = classesString => classesString
  .split(' ')
  .reduce((classesObject, cssClass) => {
    if (cssClass[0] === '!') {
      classesObject[cssClass.substring(1)] = false
      return classesObject
    }

    classesObject[cssClass] = true
    return classesObject
  }, {})

module.exports = convertStringNotationToObject
