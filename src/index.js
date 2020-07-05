const { withOptions, createOptions } = require('./options')
const { updateClasses } = require('./update-classes')

module.exports = withOptions(updateClasses, createOptions())
