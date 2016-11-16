import path from 'path'
import {ipcRenderer} from 'electron'
import {execFileSync} from 'child_process'
import * as config from '../common/config.js'
import * as CacheManager from '../common/cachemanager.js'
import * as api from '../common/api.js'
import spectate from './utils/spectate.js'

import app from './views/app.vue'

// Init vuejs
const data = {
    global: {
        gameServer: config.getGameServer(),
        summonerName: config.getSummonerName(),
        apiKey: config.getApiKey(),
        pathToLeagueFolder: config.getPathToLeagueFolder(),

        startInterval,
        cancelInterval,

        launchButtonText: 'launch',
        spectateAFriend: false,
        showLoading: false,
        showSettingsFrame: false,

        loadingdata: null
    },
    isSpectating: false
}
window.data = data

const appVue = new Vue({
    el: '.home-wrapper',
    components: {app},
    data
})

window.onbeforeunload = () => ipcRenderer.send('home-set-home')



let intervalId = 0
async function startInterval ({gameServer, summonerName, apiKey, pathToLeagueFolder}) {

    data.global.launchButtonText = 'cancel'

    // we update the config.json file with
    // the current value typed by the user
    config.setGameServer( gameServer )
    config.setSummonerName( summonerName )
    config.setApiKey( apiKey )
    config.setPathToLeagueFolder( pathToLeagueFolder )


    summonerName = CacheManager.formateSummonerName( summonerName )

    const summonerData = CacheManager.isSummonerInCache( summonerName )
        ? CacheManager.getCachedSummoner( summonerName )
        : JSON.parse( await api.getSummonersInfo(apiKey, gameServer, [summonerName]) )[summonerName]
    CacheManager.addSummonerInCache( summonerName, summonerData )

    const summonerId = summonerData.id

    // the intervalFunction will be called every 3 seconds
    const intervalTime = 3000

    const intervalFunction = async function() {

        if ( data.global.spectateAFriend === true ) {
            // we spectate a friend, so we have to use the api
            // to check if the user is in a game
            await api.getGameDataFromSummonerId(apiKey, gameServer, summonerId)

        } else {
            // we spectate the local user game, we just have
            // to check the tasklist for the league of legends.exe
            const stdout = execFileSync('tasklist', ['/fi', 'IMAGENAME eq league of legends.exe'], {encoding: 'utf8'})

            if ( stdout.indexOf('League of Legends') < 0 ) {

                if ( data.global.showLoading )
                    ipcRenderer.send('home-set-home')

                data.global.showLoading = false

                return
            }
        }

        let gameData = JSON.parse( await api.getGameDataFromSummonerId(apiKey, gameServer, summonerId) )

        // we don't send a notification if the user was already notified for this game
        if ( gameData.gameId === config.getLastGameId() )
            return

        const option = {
          title: `${summonerName} just started a game.`,
          body: "Click here to spectate the game.",
          icon: path.join(__dirname, 'imgs/backgrounds/background.jpg')
        }
        const notif = new Notification(option.title, option)
        notif.onclick = async () => {
            gameData = await spectate(apiKey, summonerName, summonerId, gameServer, gameData)

            data.global.showLoading = true
            data.global.gameData = gameData

            config.setLastGameId( gameData.gameId )

            console.log(gameData)

            ipcRenderer.send('home-set-loading')
        }

        notif.onclose = () => {
            config.setLastGameId( gameData.gameId )
        }

    }

    intervalId = setInterval( intervalFunction, intervalTime)
    intervalFunction()
}

function cancelInterval () {

    data.global.launchButtonText = 'launch'

    data.isSpectating = false

    clearInterval( intervalId )
}
