import {ipcRenderer} from 'electron'

import * as userData from '../common/userdata.js'
import * as api from '../common/api.js'
import * as cacheManager from '../common/cachemanager.js'
import {setLocalVersion, getConfig} from '../common/config.js'

import app from './views/app.vue'


const data = {
    message: 'looking for updates',
    askApiKey: false // when sets to true, a modal appears and ask for a riot games api key
}

const appVue = new Vue({
    el: '.updater-wrapper',
    components: {app},
    data
})

// check if the necessary files exist,
// if not we fill them with default content
userData.checkFiles({
    'config.json': JSON.stringify({
        localVersion: '0.0.0',
        apiKey: '',
        summonerName: 'no name',
        gameServer: 'euw',
        pathToLeagueFolder: 'null'
    }, null, '\t'),
    'cache_summoners.json': JSON.stringify({
        summoners: {}
    }),
    'cache_spells.json': '',
    'cache_runes.json': '',
    'cache_champions.json': ''
})

// we get the config file's content as an Object
const _config = getConfig()
if ( _config.apiKey === '' )
    data.askApiKey = true // setting this to 'true' will toggle a modal with vuejs (see app.vue)
else
    checkAndUpdate( _config.apiKey, _config.gameServer, _config.localVersion )

async function checkAndUpdate(apiKey, gameServer, localVersion) {
    const liveVersion = await JSON.parse(await api.getGameLiveVersion( apiKey, gameServer ))

    if ( cacheManager.isAppCacheUpdated(apiKey, liveVersion.v) )
        return  updatesDone( liveVersion.v )

    const asyncUpdateFunctions = [
        cacheManager.updateJsonSpellId,
        cacheManager.updateJsonRuneId,
        cacheManager.updateJsonChampionId
    ]

    let progress = 0
    data.message = `downloading updates ${progress / asyncUpdateFunctions.length}%`

    asyncUpdateFunctions.forEach( async fn => {
        // send an async call to get the JSON we want
        await fn( apiKey, gameServer )

        // one more file has been downloaded
        progress += 1

        const currentState = Math.round( (progress / asyncUpdateFunctions.length) * 100 )
        data.message = `downloading updates ${ currentState }%`

        if ( progress === asyncUpdateFunctions.length )
            updatesDone( liveVersion.v )
    })
}

function updatesDone ( newVersion ) {
    setLocalVersion( newVersion )
    setTimeout( ipcRenderer.send('update-done'), 25 )

    data.message = 'done!'
}
