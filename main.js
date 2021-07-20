// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { MenuItem } = require("electron/main");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.on("closed", function () {
    app.quit();
  });
  const mainMenu = Menu.buildFromTemplate(mainMunTemplate);

  Menu.setApplicationMenu(mainMenu);
  mainWindow.loadFile("mainWindow.html");
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

function createAddWindow() {
  let addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "add window",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  addWindow.on("closed", function () {
    addWindow = null;
  });

  addWindow.loadFile("addWindow.html");
}

ipcMain.on("item:add", function (e, item) {
  console.log(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

const mainMunTemplate = [
  {
    label: "Menu",
    submenu: [
      {
        label: "add item",
        click() {
          createAddWindow();
        },
      },
      {
        label: "clear item",
        click() {
          mainWindow.webContents.send("items-clear", item);
        },
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
      {
        role: "reload",
      },
    ],
  },
];

if (process.platform == "darwin") {
  mainMunTemplate.unshift({});
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
