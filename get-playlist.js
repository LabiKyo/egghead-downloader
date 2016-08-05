const fs = require('fs')
const Nightmare = require('nightmare')

const consts = require('./consts.js')

const target = '/playlists/node-web-scraping-with-javascript'

const nightmare = Nightmare(consts.nightmareOptions)

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
  .end()
  .then(playlist => {
    fs.writeFile('./playlist.json', JSON.stringify(playlist, null, '\t'), { encoding: 'utf-8' })
  })

