
export const _fetch = (url) => {

    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.open("GET", url, true)

        req.onload = () => {
            if (req.status == 200)
                resolve(req.responseText, url)
            else
                reject(req.responseText, url)
        }

        req.send()
    })

}

export const getGameLiveVersion = (apiKey, server) => {
    const url = `https://global.api.pvp.net/api/lol/static-data/${server}/v1.2/realm?api_key=${apiKey}`

    return _fetch( url )
}

export const getSummonersInfo = (apiKey, gameServer, names) => {
    const url = `https://${gameServer}.api.pvp.net/api/lol/${gameServer}/v1.4/summoner/by-name/${names.join(', ')}?api_key=${apiKey}`

    return _fetch(url)
}

export const getGameDataFromSummonerId = (apiKey, gameServer, id) => {
    const url = `https://${gameServer}.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/${gameServer.toUpperCase()}1/${id}?api_key=${apiKey}`

    return _fetch(url)
}

export const getRankedStatsFromSummonersIds = (apiKey, gameServer, ids) => {
    const url = `https://${gameServer}.api.pvp.net/api/lol/${gameServer}/v2.5/league/by-summoner/${ids.join(', ')}/entry?api_key=${apiKey}`

    return _fetch(url)
}
