
const { 
    app, 
    Menu, 
    shell, 
    ipcMain, 
    BrowserWindow, 
    globalShortcut, 
    dialog,
    fs
} = require('electron');

const template = [
    {
        role: 'help',
        submenu: [
            {
                label: 'About Editor Component',
                click() {
                    shell.openExternal('https://simplemde.com/');
                }
            }
        ]
    },
    {
        label: 'Format',
        submenu:[
            {
                label: 'Toggle Bold',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send(
                        'editor-event',
                        'toggle-bold'
                    );
                }
            }
        ]
    }
]

if (process.env.DEBUG) {
    template.push({
        label: 'Debugging',
        submenu: [
            {
                label: "Dev Tools",
                role: 'toggleDevTools'
            },
            {
                type: 'separator'
            },
            {
                role: 'reload',
                accelerator: 'Alt+R'
            }
        ]
    })
}

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    })
}

app.on('ready', () => {
    globalShortcut.register('CommandOrControl+S', () => {
        console.log('Saving the file');

        const window = BrowserWindow.getFocusedWindow();
        window.webContents.send('editor-event', 'save');
    });
});

ipcMain.on('save', (event, arg) => {
    console.log('Saving the content of the file');
    console.log(arg);

    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save markdown file',
        filters: [
            {
                name: 'MyFile',
                extensions: ['md']
            }
        ]
    };


    dialog.showSaveDialog(window, options, filename => {
        console.log('It worked!!!');
        if (filename) {
            console.log('Saving content to the file: ${filename}');
            fs.writeFileSync(filename, arg);
        }
    });
});

ipcMain.on('editor-reply', (event, arg) => {
    console.log('Received reply from web page: ${arg}');
});


const menu = Menu.buildFromTemplate(template);
module.exports = menu;