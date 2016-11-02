const fs = require('fs')

import {getLocalVersion} from './config.js'
import * as api from './api.js'
import {setContent, getContent} from './userdata.js'
// import {setGameVersion} from './config.js'

const cacheFiles = {}

export const getCacheFile = () => cacheFiles

export const cacheFolderPath = `${__dirname}/../app-data/cache`
export const cacheSummonersFile = 'cache_summoners.json'
export const cacheRunesFile = 'cache_runes.json'
export const cacheSpellsFile = 'cache_spells.json'
export const cacheChampionsFile = 'cache_champions.json'

export const isAppCacheUpdated = (apiKey, liveVersion) => {

    if ( typeof liveVersion !== "string" )
        throw new Error(`liveVersion must of type "string", \ncurrent type: ${typeof liveVersion},\n value: ${liveVersion}`)

    return getLocalVersion() === liveVersion

}

/** -----------------------------------------------
 * this function initializes the cache files
 * and put them into memory to avoid disk accesses
 * and also get a better read speed
 */

export const loadCacheJson = () => {

    ;[cacheSummonersFile, cacheRunesFile, cacheSpellsFile, cacheChampionsFile]
    .forEach(fileName => cacheFiles[file.replace('.json', '')] = JSON.parse( getContent(fileName) ))

}

/** -------------------------------------------------------------------
 * everything below this comment will be utilities to help cache usage
 * such as getting a list of the cached summoners
 * or even getting a rune informations from its ID
 */

// Setters
export const addSummonerInCache = (name, data) => {
    name = name.toLowerCase().split(' ').join('')

    const content = JSON.parse( getContent(cacheSummonersFile) )
    content.summoners[name] = data

    setContent(cacheSummonersFile, JSON.stringify(content, null, '\t'))
}

// Getters

export const getCachedSummoners = () => JSON.parse(getContent(cacheSummonersFile, 'utf8')).summoners

export const getCachedSummonersList = () => Object.keys(getCachedSummoners())

export const isSummonerInCache = (name) => getCachedSummonersList().filter(n => name.toLowerCase() === n).length > 0

export const getSpellInfoFromId = (id) => cacheFiles.spells_cache.data[id]

export const getRunesInfoFromId = (id) => cacheFiles.runes_cache.data[id]

export const getChampionInfoFromName = (name) => {
    return cacheFiles.champions_cache.data[ Object.keys(cacheFiles.champions_cache.data)
        .filter(key => cacheFiles.champions_cache.data[key].name.includes(name))[0] ]
}

export const getChampionInfoFromId = (id) => cacheFiles.champions_cache.data[ id ]

/** ------------------------------------------------------------------
 * everything below this comment will control the app's cache updates
 * it will take the json from the riot's API and then write it down
 * in .json files on the local disk to avoid wasting bandwitch each game
 */

export const updateJsonRuneId = async (apiKey, gameServer) => {
    const url = `https://global.api.pvp.net/api/lol/static-data/${gameServer}/v1.2/rune?runeListData=all&api_key=${apiKey}`

    console.log('updating: Rune cache')
    const newJsonRuneId = JSON.parse( await api._fetch(url) )
    setContent( cacheRunesFile, JSON.stringify(newJsonRuneId, null, '\t') )
}

export const updateJsonSpellId = async (apiKey, gameServer) => {
    const url = `https://global.api.pvp.net/api/lol/static-data/${gameServer}/v1.2/summoner-spell?dataById=true&spellData=all&api_key=${apiKey}`

    console.log('updating: Spells cache')
    const newJsonSpellId = JSON.parse( await api._fetch(url) )
    setContent( cacheSpellsFile, JSON.stringify(newJsonSpellId, null, '\t') )
}

export const updateJsonChampionId = async (apiKey, gameServer) => {
    const url = `https://global.api.pvp.net/api/lol/static-data/${gameServer}/v1.2/champion?dataById=true&champData=all&api_key=${apiKey}`

    console.log('updating: Champion cache')
    const newJsonChampionId = JSON.parse( await api._fetch(url) )
    setContent( cacheChampionsFile, JSON.stringify(newJsonChampionId, null, '\t') )
}

export const updateAllJsonFile = (apiKey) => {
    console.log('updating cache')
    return Promise.all([
        updateJsonSpellId(apiKey),
        updateJsonRuneId(apiKey),
        updateJsonChampionId(apiKey)
    ]).then( () => {

        return api.getGameLiveVersion(apiKey)
        .then(JSON.parse)
        .then(data => {

            setGameVersion( data.v )

            return data.v
        })

    })
}
