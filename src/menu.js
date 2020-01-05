const { app, Menu, dialog, ipcMain } = require('electron')
const path = require('path')
const {
  OPEN_DOCUMENT,
  INITIATE_SAVE,
  INITIATE_NEW_FILE,
  RENDERER_SENDING_SAVE_DATA
} = require(path.resolve('./src/actions/types.js'))

var fs = require('fs')

module.exports = function (window) {
  let currentFilePath

  function sendFileToRenderer(path) {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) return console.log(err)
      console.log('READ FILE!', data)
      // perform pdf to html

      currentFilePath = path
      window.webContents.send(OPEN_DOCUMENT, data)
    })
  }

  ipcMain.on(RENDERER_SENDING_SAVE_DATA, (event, data, saveAs) => {
    if (currentFilePath && saveAs === false) {
      fs.writeFile(currentFilePath, data, (err, data) => {
        if (err) return console.log(err)
        console.log('saved existing file!')
      })
    } else {
      dialog.showSaveDialog({
        filters: [{
          name: 'Text Files',
          extensions: ['txt']
        }]
      }, (fileNameAndPath) => {
        if (!fileNameAndPath) {
          console.log('user cancelled action')
          return
        }
        currentFilePath = fileNameAndPath

        const writeStream = fs.createWriteStream(fileNameAndPath)
        writeStream.once('open', () => {
          writeStream.write(data)
          writeStream.end()
          console.log('finished writing!')
        })
      })
    }
  })

  return Menu.buildFromTemplate([
    {
      label: `Engine`,
      submenu: [
        { label: `Open Devtools`, accelerator: "cmd+alt+i", role: 'toggledevtools' },
        { label: `Quit`, click: () => app.quit() }
      ]
    },
    {
      label: `File`,
      submenu: [
        {
          label: `New File`, accelerator: "cmd+n", click: () => {
            // probably save existing file first
            currentFilePath = null
            window.webContents.send(INITIATE_NEW_FILE)
          }
        },
        { type: 'separator' },
        {
          label: `Open...`, accelerator: "cmd+o", click: () => {
            dialog.showOpenDialog({
              properties: ['openFile'], filters: [{ name: 'PDF Files', extensions: ['pdf'] }] 
            }).then((result) => {
              if (result.canceled) {
                console.log('user cancelled action')
                return
              }
              sendFileToRenderer(result.filePaths[0])
            })
          }
        },
        { type: 'separator' },
        {
          label: `Save`, accelerator: "cmd+s", click: () => {
            window.webContents.send(INITIATE_SAVE, { saveAs: false })
          }
        },
        {
          label: `Save As...`, accelerator: "shift+cmd+s", click: () => {
            window.webContents.send(INITIATE_SAVE, { saveAs: true })
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    }
  ])
}