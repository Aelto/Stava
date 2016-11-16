import * as CacheManager from '../../common/cachemanager.js'
import * as api from '../../common/api.js'
import * as config from '../../common/config.js'
import getReleasesFolderName from './getLatestLolReleaseFolder.js'
import path from 'path'
import fs from 'fs'

export default async function (apiKey, summonerName, summonerId, gameServer) {
    CacheManager.loadCacheJson()

    data = JSON.parse( await api.getGameDataFromSummonerId(apiKey, gameServer, summonerId) )
    data = await getGameRankedStats(apiKey, gameServer, formateGameData( data ))

    return data
}

// inside the league of legends folders there are a list of all centered splash arts
// to get to these images we have to find the latest release folder
// They're named like "0.0.1.229" / "0.0.1.265" etc...
// releasesFolderName will be equal to the latest release folder based on their version
const releasesFolderName = getReleasesFolderName()
const pathToLeagueFolder = config.getPathToLeagueFolder()

function formateGameData( data ) {
    data.gameMap = data.mapId === 11
        ? `summoner's rift`
        : `not summoner's rift`

    data.gameMode = data.gameQueueConfigId === 410
        ? `RANKED`
        : `NORMAL`

    data.team1 = []
    data.team2 = []
    data.summonerIdList = []

    // map each player data in the game with the needed images' url and src.
    //
    data.participants.map(player => {

        // get the images of the summoner spells
        player.spell1Info = CacheManager.getSpellInfoFromId(player.spell1Id)
        player.spell1Splash = `http://ddragon.leagueoflegends.com/cdn/6.5.1/img/spell/${player.spell1Info.key}.png`
        player.spell2Info = CacheManager.getSpellInfoFromId(player.spell2Id)
        player.spell2Splash = `http://ddragon.leagueoflegends.com/cdn/6.5.1/img/spell/${player.spell2Info.key}.png`

        player.championInfo = CacheManager.getChampionInfoFromId(player.championId)

        const name = player.championInfo.key
        player.championSplash = path.join(pathToLeagueFolder, `RADS/projects/lol_air_client/releases/${releasesFolderName}/deploy/assets/images/champions/${name}_Splash_Centered_0.jpg`)
        // the way to get the splash (not centered!) from ddragon.leagueoflegends.com
        //`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${name}_0.jpg`

        if ( !player.soloQueueStats )
            player.soloQueueStats = {
                entries: [{ wins: 0, losses: 0}],
                tier: 'UNRANKED'
            }

        player.runesRecap = []
        player.runes.forEach(rune => {
            const obj = CacheManager.getRunesInfoFromId(rune.runeId)
            obj.count = rune.count

            player.runesRecap.push(obj)
        })

        player.masteries.map(mastery => {
            mastery.imagePath = `http://ddragon.leagueoflegends.com/cdn/6.22.1/img/mastery/${mastery.masteryId}.png`
        })

        if (player.teamId === 100) data.team1.push(player)
        else data.team2.push(player)

        data.summonerIdList.push(player.summonerId)

        return player
    })
    data.teams = [
        data.team1,
        data.team2
    ]

    data.bannedChampions.map(ban => {
        ban.championInfo = CacheManager.getChampionInfoFromId(ban.championId)

        return ban
    })

    console.log(data)
    return data
}

async function getGameRankedStats (apiKey, gameServer, gameData) {
    const stats =
    JSON.parse( await api.getRankedStatsFromSummonersIds(apiKey, gameServer, gameData.summonerIdList) )

    gameData.participants.map(player => {
        const playerStats = stats[player.summonerId]
        if (!playerStats) return player

        player.rankedStats = playerStats

        const soloQ = playerStats.filter(queue => queue.queue === 'RANKED_SOLO_5x5')[0]
            || {entries: [{ wins: 0, losses: 0 }], tier: 'UNRANKED'}

        player.soloQueueStats = soloQ

        return player
    })

    return await gameData
}
