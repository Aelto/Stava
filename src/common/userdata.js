const app = require('electron').remote.app
import path from 'path'
import fs from 'fs'

const subFolder = 'data'

if ( fs.readdirSync(app.getPath('userData')).indexOf(subFolder) < 0 )
    fs.mkdirSync( path.join(app.getPath('userData'), subFolder) )

export const getPath = () => path.join( app.getPath('userData'), subFolder)

/**
 * @param filesObject {OBJECT} >> { filePath: defaultContent }
 */
export const checkFiles = filesObject => {
    Object.keys( filesObject ).forEach( filePath => {
        let dir = path.join( getPath(), path.dirname( filePath ) )
        let name = path.basename( filePath )

        if ( fs.readdirSync( dir ).indexOf( name ) < 0 ) {
            fs.writeFileSync( path.join(dir, filePath), filesObject[filePath], 'utf8' )
        }
    })
}

export const getContent = filePath => fs.readFileSync( path.join(getPath(), filePath), 'utf8' )

export const setContent = (filePath, content) => fs.writeFileSync( path.join(getPath(), filePath), content, 'utf8' )
