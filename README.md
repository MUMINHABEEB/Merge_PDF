# Merge PDF Desktop App

Electron-based desktop utility to quickly merge multiple PDF files with an intuitive drag & drop UI (similar to popular online tools) while keeping everything offline.

## Screenshots
_(Add a screenshot of the app window here once you run it – drag an image into `docs/` and reference it.)_

## Features
- Add PDF files via button or drag & drop
- Re‑order by drag, Move Up/Down buttons, or remove individual files
- Quick filter box to find a file among many
- Merge into single PDF (uses pure JS `pdf-lib`, no external binaries)
- Windows installer generated via either:
	- `electron-builder` (NSIS) – default
	- Inno Setup script (`installer.iss`) – optional alternative
- Automated GitHub Release build on version tag push (workflow in `.github/workflows/release.yml`)

## Folder Structure
```
electron/           # Electron app source
	main.js           # Main process
	preload.js        # Secure API exposure to renderer
	renderer/         # UI (HTML/CSS/JS)
	package.json      # App & build config
	installer.iss     # Optional Inno Setup script
.github/workflows/  # CI release workflow
merge_pdf.py        # (Original script placeholder if needed later)
```

## Getting Started (Dev)
```powershell
cd electron
npm install
npm start
```
The app window should open; add some PDFs and test merging (output is saved to a location you choose).

## Building Locally
Disable auto code-sign discovery (not needed for unsigned dev builds) and build:
```powershell
cd electron
$env:CSC_IDENTITY_AUTO_DISCOVERY="false"
npm run dist
```
Outputs:
- `electron/dist/win-unpacked/MergePDF.exe` (portable folder)
- `electron/dist/*.exe` (NSIS installer, if build completes)

If symlink / signing helper errors appear but `win-unpacked` is produced, you can still proceed to Inno Setup.

## Optional Inno Setup Installer
After a build leaves `dist/win-unpacked`:
```powershell
cd electron
npm run inno   # wraps ISCC.exe installer.iss
```
Result: `electron/installer-output/MergePDFSetup.exe` – classic wizard installer.
Adjust the path to `ISCC.exe` in the `inno` script if your Inno Setup install directory differs.

## Automated GitHub Release
1. Commit changes & push to `main`.
2. Tag a version following `v*` pattern, e.g.:
	 ```powershell
	 git tag v0.2.0
	 git push origin v0.2.0
	 ```
3. GitHub Action builds and attaches installer artifacts to the Release.

## Updating Version
Edit `electron/package.json` `version`, commit, then create a matching tag (e.g., `v0.2.0`). Keep versions in sync.

## Tech Stack
- Electron 30
- pdf-lib for PDF page manipulation
- Vanilla HTML/CSS/JS (no framework for simplicity)

## Security Notes
- Renderer runs with `contextIsolation` and no Node integration; only whitelisted IPC (`pick-pdfs`, `merge-pdfs`).
- All processing stays local; files never leave the machine.

## Future Enhancements (Roadmap)
- Page range selection per file
- Remove / rotate individual pages before merge
- Dark mode toggle
- Drag in whole folders (auto filter PDFs)
- Linux & macOS packaging
- Signed Windows installer & auto-update (Squirrel / electron-updater)
- PDF preview thumbnails (generate 1st page to canvas)

## Contributing
Feel free to open issues or PRs with enhancements. Keep PRs focused and include a short description + screenshot for UI changes.

## License
MIT – see `LICENSE` (add one if missing).

---
Need improvements (icons, updater, thumbnails)? Open an issue or request.