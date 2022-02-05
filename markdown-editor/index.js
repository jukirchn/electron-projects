// 1. import electron objects
const { app, BrowserWindow, Menu } = require('electron');
const menu = require('./menu');

// 2. reserve a reference to window object
let window;

// 3. wait till application started
app.on('ready', () => {
    // 4. create a new window
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For enabling require() command in script section of html file
        }
    })


// load window content
window.loadFile('index.html');
});

Menu.setApplicationMenu(menu);