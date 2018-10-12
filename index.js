const electron = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let toDoWindow;
const PATH_PREFIX="file://" + __dirname + "/";

app.on('ready', () => {
    mainWindow = new BrowserWindow();
    var path = PATH_PREFIX+ "main.html";
    // console.log(process.env.NODE_ENV);
    mainWindow.loadURL(path);
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed',() => {
        app.quit();
    });
    
});


const handleNewTodo=() => {
    toDoWindow=new BrowserWindow({width:300,height:200,title:'New To-Do'});
    toDoWindow.loadURL(PATH_PREFIX+"todo.html");
    toDoWindow.on('closed', () => {
        toDoWindow=null;
    })
}

ipcMain.on('todo:add',(event,todoValue) => {
    mainWindow.webContents.send('todo:add',todoValue);
    toDoWindow.close();
})

ipcMain.on('todo:new',() => {
    handleNewTodo();
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New ToDo' ,
                click:handleNewTodo,
                accelerator: process.platform=='darwin' ? 'Command+N' : 'Ctrl+N'
            },
            { 
                label: 'Clear List' ,
                click:() => {
                    mainWindow.webContents.send('todo:clear');
                },
                accelerator: process.platform=='darwin' ? 'Command+C' : 'Ctrl+C'
            },
            {
                label:'Quit',
                accelerator: process.platform==='darwin' ? 'Command+Q' : 'Ctrl+Q',
                click:()=>{app.quit();}
            }
        ]
    }
];

if(process.platform=='darwin'){
    menuTemplate.unshift({});
}

if(process.env.NODE_ENV=='development'){
    menuTemplate.push({
        label:'DEVELOPMENT',
        submenu:[
            {
                role:'reload'
            },
            {
                label:'Togle Dev. Tools',
                accelerator:'F12',
                click: (item,focusedWindow) => {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}



