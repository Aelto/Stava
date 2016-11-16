import path from 'path'
import fs from 'fs'
import {getPathToLeagueFolder} from '../../common/config.js'

export default function releasesFolderName() {
    return fs.readdirSync( path.join(getPathToLeagueFolder(), `RADS/projects/lol_air_client/releases/`) )
        .reduce((result, currentName) => {
            const versionNumber = parseInt( currentName.split('.').join('') )
            const resultNumber = parseInt( result.split('.').join('') )

            if ( Number.isNaN(versionNumber) )
                return result

            return versionNumber > resultNumber
                ? currentName
                : result
        }, "0")
}
