const Nightmare = require('nightmare')

const tasks = require('./tasks.js')

const consts = require('./consts.js')

const nightmare = Nightmare(consts.nightmareOptions)

nightmare
  .use(tasks.login(() => {
    nightmare.use(tasks.getPlaylist('/playlists/node-web-scraping-with-javascript', playlist => {
      nightmare.use(tasks.getEpisodes(playlist, () => {
        console.log('done')
      }))
    }))
  }))
