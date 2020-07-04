const updateClassesWithObject = require('./update-classes-with-object')
const convertStringNotationToObject = require('./convert-string-notation-to-object')
const ensureArray = require('./utils/ensure-array')

const updateClasses = (targets, classes) => {
  targets = ensureArray(targets)

  if (Array.isArray(classes)) {
    classes.forEach(classCombination => updateClasses(targets, classCombination))
  } else if (typeof classes === 'object') {
    updateClassesWithObject(targets, classes)
  } else {
    updateClassesWithObject(targets, convertStringNotationToObject(String(classes)))
  }
}

module.exports.updateClasses = updateClasses
