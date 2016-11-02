const electron = require('electron')
const {app, BrowserWindow} = electron
const {Menu, Tray, ipcMain} = electron



let home, updater
app.on('ready', () => {

    // first the updater is opened, it will checks for updates
    // from the github repo and the riot servers. Once it's done
    // it will triggers the event 'update-done' which will open
    // the home window
    updater = new BrowserWindow({
        width: 480,
        height: 270,
        frame: false
    })
    updater.loadURL(`file://${__dirname}/app/updater/index.html`)
    updater.webContents.openDevTools()

    ipcMain.on('update-done', () => {
        home = new BrowserWindow({
            width: 960,
            height: 540,
            frame: false
        })
        home.loadURL(`file://${__dirname}/app/home/index.html`)
        home.webContents.openDevTools()

        updater.close()

        home.on('closed', () => {
            home = null
        })
    })

    updater.on('closed', () => {
        updater = null
    })

    ipcMain.on('updater-reload', () => updater.reload())
    ipcMain.on('updater-focus', () => updater.focus())

    ipcMain.on('home-reload', () => home.reload())
    ipcMain.on('home-focus', () => home.focus())
    ipcMain.on('home-minimize', () => home.minimize())
    ipcMain.on('home-maximize', () => home.maximize())
    ipcMain.on('home-unmaximize', () => home.unmaximize())
    ipcMain.on('home-close', () => home.close())
})

app.on('window-all-closed', () => {

    if ( process.platform !== 'darwin' )
        app.quit()

})
