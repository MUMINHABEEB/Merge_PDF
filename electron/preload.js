const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  pickPdfs: () => ipcRenderer.invoke('pick-pdfs'),
  mergePdfs: (files) => ipcRenderer.invoke('merge-pdfs', files)
});
