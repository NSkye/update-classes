const updateClassesWithObject = require('./update-classes-with-object')
const convertStringNotationToObject = require('./convert-string-notation-to-object')
const flatten = require('./utils/flatten')
const ensureArray = require('./utils/flatten')

const createOptions = () => ({
  scope: '',
  ensureTargets: [],
  ensureClasses: []
})

const copyClasses = (classes) => {
  return typeof classes === 'object'
    ? { ...classes }
    : classes
}

const scopeClasses = (scope) => (classes) => {
  if (typeof classes === 'string') {
    classes = convertStringNotationToObject(classes)
  }
  
  const result = {}
  for (const className in classes) {
    result[String(scope) + String(className)] = classes[className]
  }

  return result
}

const mergeOptions = (options1, options2) => ({
  scope: options1.scope + options2.scope,
  ensureTargets: options1.ensureTargets.concat(options2.ensureTargets),
  ensureClasses: ([
    ...flatten(options1.ensureClasses),
    ...flatten(options2.ensureClasses)
  ])
    .map(copyClasses)
})

const copyOptions = (options) => ({
  scope: options.scope,
  ensureTargets: [...options.ensureTargets],
  ensureClasses: flatten(options.ensureClasses)
    .map(copyClasses)
})


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

const withOptions = (uc, options) => {
  options = uc.__extractOptions
    ? mergeOptions(uc.__extractOptions(), options)
    : options

  const result = (targets, classes) => {
    if (!targets) { targets = [] }
    if (!classes) { classes = [] }

    targets = ensureArray(targets)
      .concat(options.ensureTargets)

    classes = flatten(
      ensureArray(classes).concat(options.ensureClasses.map(copyClasses))
    ).map(scopeClasses(options.scope))

    return updateClasses(targets, classes)
  }

  result.__extractOptions = () => copyOptions(options)

  result.scope = (scopeName) => {
    const newOptions = createOptions()
    newOptions.scope = scopeName

    return withOptions(result, newOptions)
  }

  result.target = (target) => {
    const newOptions = createOptions()
    newOptions.ensureTargets = ensureArray(target)

    return withOptions(result, newOptions)
  }

  result.classes = (classesArray) => {
    const newOptions = createOptions()
    newOptions.ensureClasses = classesArray

    return withOptions(result, newOptions)
  }

  return result
}

updateClasses.scope = (scopeName) => {
  const options = createOptions()
  options.scope = scopeName

  return withOptions(updateClasses, options)
}

updateClasses.target = (target) => {
  const options = createOptions()
  options.ensureTargets = [target]

  return withOptions(updateClasses, options)
}

updateClasses.classes = (classes) => {
  const options = createOptions()
  options.ensureClasses = ensureArray(classes)

  return withOptions(updateClasses, options)
}

module.exports = updateClasses
