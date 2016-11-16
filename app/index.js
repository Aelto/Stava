const electron = require('electron')
const {app, BrowserWindow} = electron
const {Menu, MenuItem, Tray, ipcMain} = electron

const iconPath = `${__dirname}/stava_icon.ico`

let home, updater, loading
app.on('ready', () => {

    // first the updater is opened, it will checks for updates
    // from the github repo and the riot servers. Once it's done
    // it will triggers the event 'update-done' which will open
    // the home window
    updater = new BrowserWindow({
        width: 480,
        height: 270,
        frame: false,
        //icon: iconPath,
        resizable: false
    })
    updater.loadURL(`file://${__dirname}/bin/updater/index.html`)
    // updater.webContents.openDevTools()

    ipcMain.on('update-done', () => {
        home = new BrowserWindow({
            width: 960,
            height: 540,
            frame: false,
            icon: iconPath,
            resizable: false
        })
        home.loadURL(`file://${__dirname}/bin/home/index.html`)
        // home.webContents.openDevTools()

        updater.close()

        const tray = new Tray(iconPath)
        tray.setToolTip('Stava')

        const menuItem_show = new MenuItem({
            label: 'Show Stava',
            type: 'normal',
            click: () => home.show()
        })
        const menuItem_hide = new MenuItem({
            label: 'Hide Stava',
            type: 'normal',
            click: () => home.hide()
        })
        const contextMenu = Menu.buildFromTemplate([
            menuItem_show,
            menuItem_hide,
            {label: 'sep', type: 'separator'},
            {label: 'Close Stava', type: 'normal', role: 'quit'}
        ])
        tray.setContextMenu(contextMenu)

        contextMenu.items[0].visible = false

        home.on('closed', () => home = null)
        home.on('show', () => {
            contextMenu.items[0].visible = false
            contextMenu.items[1].visible = true
        })
        home.on('hide', () => {
            contextMenu.items[0].visible = true
            contextMenu.items[1].visible = false
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

    // set the home an appropriate size and position
    // for the loading screen
    let positionBeforeLoading = null
    ipcMain.on('home-set-loading', () => {
        positionBeforeLoading = home.getPosition()

        home.setSize(1600, 900)
        home.center()
        //home.setAlwaysOnTop(true)

        home.show()
    })

    ipcMain.on('home-set-home', () => {
        const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

        home.setSize(960, 540)
        if (positionBeforeLoading !== null)
            home.setPosition(positionBeforeLoading[0], positionBeforeLoading[1])
        home.setAlwaysOnTop(false)
    })
})

app.on('window-all-closed', () => {

    if ( process.platform !== 'darwin' )
        app.quit()

})
