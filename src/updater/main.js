import {ipcRenderer} from 'electron'

import * as userData from '../common/userdata.js'
import * as api from '../common/api.js'
import * as cacheManager from '../common/cachemanager.js'
import {setLocalVersion} from '../common/config.js'

import app from './views/app.vue'


const data = {
    message: 'looking for updates',
    askApiKey: false // when sets to true, a modal appears and ask for an riot games api key
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
        gameServer: 'euw'
    }, null, '\t'),
    'cache_summoners.json': JSON.stringify({
        summoners: {}
    }),
    'cache_spells.json': '',
    'cache_runes.json': '',
    'cache_champions.json': ''
})

// we now get the config file's content
const config = JSON.parse( userData.getContent('config.json') )
if ( config.apiKey === '' )
    data.askApiKey = true // setting this to 'true' will toggle a modal with vuejs (see app.vue)
else {
    // the app needs a riot games api key to continue
    // hence the 'if else'

    checkAndUpdate( config.apiKey, config.gameServer, config.localVersion )
}

async function checkAndUpdate(apiKey, gameServer, localVersion) {
    /*const liveVersion =  JSON.parse(await api.getGameLiveVersion( apiKey, gameServer ))
    const isAppUpToDate = typeof localVersion === "string" && localVersion === liveVersion.v

    if ( isAppUpToDate ) {
        // do something TODO now that the app is up to date
        return console.log( 'the app is up to date' )
    }
    console.log( 'the app is not up to date' )*/

    const liveVersion = await JSON.parse(await api.getGameLiveVersion( apiKey, gameServer ))

    if ( cacheManager.isAppCacheUpdated(apiKey, liveVersion.v) ) {
        // do something TODO now that the app is up to date
        return  updatesDone( liveVersion.v )
    }

    const asyncUpdateFunctions = [
        cacheManager.updateJsonSpellId,
        cacheManager.updateJsonRuneId,
        cacheManager.updateJsonChampionId
    ]

    let progress = 0
    data.message = `downloading updates ${progress / asyncUpdateFunctions.length}%`

    asyncUpdateFunctions.forEach( async fn => {
        await fn( apiKey, gameServer )

        progress += 1

        const currentState = Math.round( (progress / asyncUpdateFunctions.length) * 100 )
        data.message = `downloading updates ${ currentState }%`

        if ( progress === asyncUpdateFunctions.length )
            updatesDone( liveVersion.v )
    })
}

function updatesDone ( newVersion ) {

    data.message = 'done!'

    setLocalVersion( newVersion )

    setTimeout( ipcRenderer.send('update-done'), 25 )

}
