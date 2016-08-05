function getConfig() {
  try {
    return require('./config.js')
  } catch (err) {
    console.error(err.message)
    console.error('Please copy `config.js.example` to `config.js` and fill in your account first.')
  }
}

module.exports = {
  getConfig,
}
