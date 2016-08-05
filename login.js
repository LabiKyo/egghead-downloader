const fs = require('fs')
const Nightmare = require('nightmare')
const getConfig = require('./utils.js').getConfig

const consts = require('./consts.js')
const config = getConfig()

Nightmare({
  show: true,
  pollInterval: 100,
  waitTimeout: 5000,
  gotoTimeout: 5000,
})
  .goto(consts.domain + consts.signIn)
  .insert('#user_email', config.email)
  .insert('#user_password', config.password)
  .click('input[type=submit][name=commit]')
  .wait('#flash_notice')
  .cookies.get()
  .end()
  .then(cookies => {
    fs.writeFileSync('./cookies.json', JSON.stringify(cookies), { encoding: 'utf-8' })
  })
