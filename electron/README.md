# MergePDF Electron App

Desktop tool to merge multiple PDF files with drag & drop ordering.

## Dev Setup

1. Install dependencies
```
npm install
```
2. Run in development
```
npm start
```
3. Create production build / installer (uses electron-builder NSIS)
```
npm run dist
```

## Features
- Add PDFs via button, drag & drop
- Reorder via buttons or drag
- Remove files
- Filter list with quick search
- Merge into single PDF using pdf-lib

## Inno Setup
Electron-builder already produces an NSIS installer. If you specifically need Inno Setup script, see `installer.iss` example below.
