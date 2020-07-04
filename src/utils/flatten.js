const ensureArray = require('./ensure-array')

module.exports = array => {
  array = ensureArray(array)
  const result = []
  const throughArray = array => array.forEach(element => {
    if (Array.isArray(element)) {
      throughArray(element)
    }
    result.push(element)
  })
  throughArray(array)
  return result
}
