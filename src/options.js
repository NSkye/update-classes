const convertStringNotationToObject = require('./convert-string-notation-to-object')
const ensureArray = require('./utils/ensure-array')
const flatten = require('./utils/flatten')

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

const processClasses = (classes, ensureClasses, scope) => flatten(
  ensureArray(classes)
    .concat(ensureClasses.map(copyClasses))
).map(scopeClasses(scope))

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


function afterEvent(eventName, targets, classes, updateClasses) {
  targets = ensureArray(targets)

  const updateOnEvent = ({ target }) => {
    updateClasses(target, classes)
    target.removeEventListener(eventName, updateOnEvent)
  }

  targets.forEach(target => target.addEventListener(eventName, updateOnEvent))
}

const withOptions = (updateClassesFunction, options) => {
  const originalUpdateClassesFunction = updateClassesFunction.__extractOriginal
    ? updateClassesFunction.__extractOriginal()
    : updateClassesFunction

  options = updateClassesFunction.__extractOptions
    ? mergeOptions(updateClassesFunction.__extractOptions(), options)
    : options

  const result = (targets, classes) => {
    if (!targets) { targets = [] }
    if (!classes) { classes = [] }

    targets = ensureArray(targets)
      .concat(options.ensureTargets)

    classes = processClasses(
      classes,
      options.ensureClasses,
      options.scope
    )

    originalUpdateClassesFunction(targets, classes)
    return {
      and: result,
      also: result,
      afterTransition: classes => afterEvent('transitionend', targets, processClasses(
        classes,
        options.ensureClasses,
        options.scope
      ), originalUpdateClassesFunction),
      afterAnimation: classes => afterEvent('animationend', targets, processClasses(
        classes,
        options.ensureClasses,
        options.scope
      ), originalUpdateClassesFunction)
    }
  }

  result.__extractOriginal = () => originalUpdateClassesFunction
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

module.exports.createOptions = createOptions
module.exports.withOptions = withOptions
