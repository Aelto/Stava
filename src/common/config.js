import * as userData from './userdata.js'

// GET
export const getConfig = () => JSON.parse( userData.getContent('config.json') )

export const getSummonerName = () => getConfig().summonerName || ''
export const getApiKey = () => getConfig().apiKey || ''
export const getLocalVersion = () => getConfig().localVersion || ''
export const getLastGameId = () => getConfig().lastGameId || -1
export const getGameServer = () => getConfig().gameServer || ''
export const getPathToLeagueFolder = () => getConfig().pathToLeagueFolder || ''

// SET
export const setConfig = newConfig => userData.setContent('config.json', JSON.stringify(newConfig, null, '\t'))

export const _setConfigKey = ( key, value ) => {
    const config = getConfig()
    config[key] = value

    setConfig( config )
}
export const setSummonerName = (newSummonerName) => _setConfigKey( 'summonerName', newSummonerName)
export const setApiKey = (newApiKey) => _setConfigKey( 'apiKey', newApiKey )
export const setLocalVersion = (newLocalVersion) => _setConfigKey( 'localVersion', newLocalVersion )
export const setLastGameId = (newLastGameId) => _setConfigKey( 'lastGameId', newLastGameId )
export const setGameServer = (newGameServer) => _setConfigKey( 'gameServer', newGameServer )
export const setPathToLeagueFolder = (newPathToLeagueFolder) => _setConfigKey( 'pathToLeagueFolder', newPathToLeagueFolder )
