const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const child = require('child_process').execFile;

const path = require('path');
const fs = require('fs');
const os = require('os');
const ipc = electron.ipcMain;
const shell = electron.shell;

let executablePath = path.join(__dirname,'server/roshi.exe');
if(fs.existsSync(executablePath)){
  child(executablePath, function(err, data) {
    if(err){
       console.error(err);
       return;
    }  
    console.log(data.toString());
  });  
}

let win;
let printWindow;


function createWindow() {
  win = new BrowserWindow({
   // fullscreen: true,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, 'dist/brs/assets/icons/win/icon.ico'),
    title:  __dirname, // 'ब्यवसाय दर्ता प्रणाली',
    webPreferences: {
      nativeWindowOpen: false, // add this
      nodeIntegration: true
    }
  });

  win.loadURL(`file://${__dirname}/dist/brs/index.html`);

  win.maximize();

  //hide menu
  win.setMenu(null);

  //uncomment to openwith devtool
  // win.webContents.openDevTools();

  win.on('closed', function () {
    // if (printWindow) {
      printWindow = null;
    // }
    win = null;
  });

  printWindow = new BrowserWindow({
    height:0,
    width:0,
    parent: win,
    show:false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  printWindow.loadURL(`file://${__dirname}/dist/brs/assets/print/worker.html`);
  //printWindow.hide();
  printWindow.webContents.openDevTools();
  printWindow.on("closed", () => {
    printWindow = undefined;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (win === null) {
    createWindow();
  }
});

ipc.on("printPDF", (event, content) => {
  // console.log(content);
  printWindow.webContents.send("printPDF", content);
});


ipc.on("readyToPrintPDF", (event) => {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf');
  // Use default printing options
  printWindow.webContents.printToPDF({}, function (error, data) {
      if (error) throw error
      fs.writeFile(pdfPath, data, function (error) {
          if (error) {
              throw error
          }
          shell.openItem(pdfPath)
          event.sender.send('wrote-pdf', pdfPath)
      })
  })
});

ipc.on('print', (event, content) => {
  printWindow.webContents.send('print', content);
});

ipc.on('readyToPrint', (event) => {
  printWindow.webContents.print({silent:false, printBackground:true});
});
// ipc.on('print-to-pdf', function (event) {
//   const pdfPath = path.join(os.tmpdir(), 'print.pdf');
//   const win = BrowserWindow.fromWebContents(event.sender);
//   win.webContents.printToPDF({}, function (error, data) {
//     if (error) return console.log(error.message);

//     fs.writeFile(pdfPath, data, function (err) {
//       if (err) return console.log(err.message);
//       shell.openExternal('file://' + pdfPath);
//       event.sender.send('wrote-pdf', pdfPath);
//     })
//   })
// })