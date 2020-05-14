const updateClassesWithObject = require('./update-classes-with-object')
const convertStringNotationToObject = require('./convert-string-notation-to-object')

/**
 * Updates classlist of HTML-element(s).
 * As first argument it will take either one HTMLElement or array
 * of HTMLElements, classList of which is subject to modification.
 * As second parameter it will accept:
 * - object, where key is class in question and value has following effect:
 * true -- add class,
 * false -- remove class,
 * any string -- replace class with this string
 * - string with optional prefix:
 * '!' -- remove class,
 * no prefix -- add class
 * - array, within which you can group both previous types of parameters
 * @param {HTMLElement|Array<HTMLElement>} targets whose classList we will change
 * @param {string|object|(string|object[])} classes how we will change it
 * @returns {object} object where keys 'and' and 'also' refer to self (for chaining)
 */
const updateClasses = (targets, classes) => {
  targets = Array.isArray(targets)
    ? targets
    : [targets]

  if (Array.isArray(classes)) {
    classes.forEach(classCombination => updateClasses(targets, classCombination))
  } else if (typeof classes === 'object') {
    updateClassesWithObject(targets, classes)
  } else {
    updateClassesWithObject(targets, convertStringNotationToObject(String(classes)))
  }

  const returnObject = {
    and: updateClasses,
    also: updateClasses,
    afterTransition: classes => {
      afterTransition(targets, classes)
      return returnObject
    },
    afterAnimation: classes => {
      afterAnimation(targets, classes)
      return returnObject
    }
  }

  return returnObject
}

function afterEvent(eventName, targets, classes) {
  targets = Array.isArray(targets)
    ? targets
    : [targets]

  const updateOnEvent = ({ target }) => {
    updateClasses(target, classes)
    target.removeEventListener(eventName, updateOnEvent)
  }

  targets.forEach(target => target.addEventListener(eventName, updateOnEvent))
}

function afterTransition(targets, classes) {
  return afterEvent('transitionend', targets, classes)
}

function afterAnimation(targets, classes) {
  return afterEvent('animationend', targets, classes)
}

module.exports = updateClasses
