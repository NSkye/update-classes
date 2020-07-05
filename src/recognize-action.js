const methods = {
  true: 'add',
  false: 'remove',
  '~toggle': 'toggle'
}

const recognizeAction = (action, className) => (
  typeof action === 'string' && action !== '~toggle'
    ? { method: 'replace', args: [className, action] }
    : { method: methods[action] || methods[!!action], args: [className] }
)

module.exports = recognizeAction
