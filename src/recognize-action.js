const methods = {
  true: 'add',
  false: 'remove'
}

const recognizeAction = (action, className) => (
  typeof action === 'string'
    ? { method: 'replace', args: [className, action] }
    : { method: methods[!!action], args: [className] }
)

module.exports = recognizeAction
