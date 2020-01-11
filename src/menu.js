const { app, Menu, dialog, ipcMain } = require('electron')
const settings = require('electron-settings')
const path = require('path')
const {
  OPEN_DOCUMENT,
  INITIATE_SAVE,
  INITIATE_NEW_FILE,
  RENDERER_SENDING_SAVE_DATA,
  RENDERER_SETTING_PROJECT,
  RENDERER_CREATING_PROJECT,
  APP_LOADED,
  SENDING_SETTINGS,
  LISTS_UPDATED
} = require(path.resolve('./src/actions/types.js'))

var fs = require('fs')

module.exports = function (window) {
  let currentFilePath

  function sendFileToRenderer(path) {
    fs.readFile(path, function (err, data) {
      if (err) return console.log(err)

      const jsonData = JSON.parse(data)
      console.log('JSON DATA', jsonData)
      
      currentFilePath = path
      window.webContents.send(OPEN_DOCUMENT, jsonData)
    })
  }

  
  ipcMain.on(APP_LOADED, async (event, name) => {
    const projSettings = settings.get('projects') // should eventually include all settings
    window.webContents.send(SENDING_SETTINGS, projSettings)
  })

  ipcMain.on(LISTS_UPDATED, async (event, lists, projectName) => {
    console.log('lists have been updated', projectName, lists)
    settings.set(`projects.${projectName}.sublists`, lists)
    const project = settings.get(`projects.${projectName}`)
    console.log('checking set', project)
  })

  ipcMain.on(RENDERER_CREATING_PROJECT, async (event, name, docId) => {
    console.log('renderer created new project', name)
    settings.set(`projects.${name}`, {
      sublists:[]
    })
    settings.set(`documents.${docId}.project`, name)
  })

  ipcMain.on(RENDERER_SETTING_PROJECT, async (event, name, docId) => {
    console.log('renderer set project', name, docId)
    settings.set(`documents.${docId}.project`, name)
  })

  ipcMain.on(RENDERER_SENDING_SAVE_DATA, async (event, data, saveAs) => {
    console.log('received data', data)
    if (currentFilePath && saveAs === false) {
      fs.writeFile(currentFilePath, JSON.stringify(data), (err, data) => {
        if (err) return console.log(err)
        console.log('saved existing file!')
      })
    } 
    else {
      const { filePath, canceled } = await dialog.showSaveDialog({
        filters: [{
          name: 'JSON Files',
          extensions: ['json']
        }]
      })
      if (canceled) {
        console.log('user cancelled action')
        return
      }
      currentFilePath = filePath
      const writeStream = fs.createWriteStream(filePath)
      writeStream.once('open', () => {
        writeStream.write(JSON.stringify(data))
        writeStream.end()
        console.log('finished writing!')
      })
    }
  })

  return Menu.buildFromTemplate([
    {
      label: `Engine`,
      submenu: [
        { label: `Open Devtools`, accelerator: 'cmd+alt+i', role: 'toggledevtools' },
        { label: `Quit`, click: () => app.quit() }
      ]
    },
    {
      label: `File`,
      submenu: [
        {
          label: `New File`, accelerator: 'cmd+n', click: () => {
            // probably save existing file first
            currentFilePath = null
            window.webContents.send(INITIATE_NEW_FILE)
          }
        },
        { type: 'separator' },
        {
          label: `Open...`, accelerator: 'cmd+o', click: async () => {
            const { filePaths, canceled } = await dialog.showOpenDialog({
              properties: ['openFile'], filters: [{ extensions: ['json'] }] 
            })
            if (canceled) {
              console.log('user cancelled action')
              return
            }
            sendFileToRenderer(filePaths[0])
          }
        },
        { type: 'separator' },
        {
          label: `Save`, accelerator: 'cmd+s', click: () => {
            window.webContents.send(INITIATE_SAVE, { saveAs: false })
          }
        },
        {
          label: `Save As...`, accelerator: 'shift+cmd+s', click: () => {
            window.webContents.send(INITIATE_SAVE, { saveAs: true })
          }
        }
      ]
    },
    {
      label: 'Edit',
      role: 'editMenu'
    },
    {
      label: 'View',
      role: 'viewMenu'
    }
  ])
}