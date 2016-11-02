
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
