const fs = require('fs')
const Nightmare = require('nightmare')

const consts = require('./consts.js')

const cookies = JSON.parse(fs.readFileSync('./cookies.json', { encoding: 'utf-8' }))

const playlist = JSON.parse(fs.readFileSync('./playlist.json', { encoding: 'utf-8' }))
const nightmare = Nightmare(consts.nightmareOptions)

nightmare
  .goto(consts.domain)
  .cookies.set(cookies)
  .then(() => {
    console.log('cookie set')
    playlist.map((episode, index) => {
      return () => new Promise((resolve, reject) => {
        nightmare
          .goto(episode.href)
          .wait('source')
          .evaluate(() => document.querySelector('source').src)
          .then(url => {
            console.log(`downloading episode ${index + 1}: ${episode.title} from ${url}`)
            resolve()
          })
          .catch(reject)
        })
    })
    .reduce((previous, current) => {
      return previous.then(current)
    }, Promise.resolve())
    .then(() => {
      nightmare.end()
    })
  })

