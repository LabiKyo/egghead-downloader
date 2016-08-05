const fs = require('fs')
const util = require('util')
const getConfig = require('./utils.js').getConfig

const consts = require('./consts.js')
const config = getConfig()

exports.login = callback => nightmare =>
  nightmare
    .goto(consts.domain + consts.signIn)
    .insert('#user_email', config.email)
    .insert('#user_password', config.password)
    .click('input[type=submit][name=commit]')
    .wait('#flash_notice')
    .cookies.get()
    .then(cookies => {
      console.log('Login success.')
      console.log('Write cookies to `cookies.json`.')
      fs.writeFile('./cookies.json', JSON.stringify(cookies, null, '\t'), { encoding: 'utf-8' }, callback)
    })

exports.getPlaylist = (target, callback) => nightmare => {
  console.log('Fetching playlist for', target)
  nightmare
    .goto(consts.domain + target)
    .wait('h4 a')
    .evaluate(() => {
      const playlist = Array
        .from(document.querySelectorAll('h4 a'))
        .map(elem => ({
          href: elem.href,
          title: elem.textContent,
        }))
      return playlist
    })
    .then(playlist => {
      console.log(`Playlist is ${util.inspect(playlist, { depth: null })}`)
      callback(playlist)
    })
}

exports.getEpisodes = (playlist, callback) => nightmare => {
  console.log('Fetching episodes.')
  playlist.reduce((promise, episode, index) =>
    promise.then(() => new Promise ((resolve, reject) => {
      console.log(`Fetching episode ${index + 1}.`)
      nightmare
        .goto(episode.href)
        .wait('source')
        .evaluate(() => document.querySelector('source').src)
        .then(url => {
          console.log(`Downloading episode ${index + 1}: ${episode.title} from ${url}.`)
          resolve()
        })
        .catch(reject)
    }))
  , Promise.resolve())
  .then(() => {
    console.log('Finish downloading.')
    callback()
  })
}
