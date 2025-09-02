const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  await mainWindow.loadFile('renderer/index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('pick-pdfs', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select PDF files',
    filters: [{ name: 'PDFs', extensions: ['pdf'] }],
    properties: ['openFile', 'multiSelections']
  });
  if (canceled) return [];
  return filePaths;
});

ipcMain.handle('merge-pdfs', async (event, files) => {
  if (!files || !files.length) throw new Error('No files provided');
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = fs.readFileSync(file);
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(p => mergedPdf.addPage(p));
  }
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save merged PDF',
    defaultPath: path.join(app.getPath('desktop'), 'merged.pdf'),
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (!filePath) return { saved: false };
  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(filePath, mergedBytes);
  return { saved: true, output: filePath };
});
