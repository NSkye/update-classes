const recognizeAction = require('./recognize-action')

const updateClassesWithObject = (targets, classes) => {
  targets.forEach(({ classList }) => {
    for (const className in classes) {
      const action = classes[className]
      const { method, args } = recognizeAction(action, className)
      classList[method](...args)
    }
  })
}

module.exports = updateClassesWithObject
