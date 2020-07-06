const { updateClassesOriginal } = require('./update-classes-original')
const { withOptions, createOptions } = require('./options')

module.exports = withOptions(updateClassesOriginal, createOptions())
