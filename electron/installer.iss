; Inno Setup script for MergePDF (manual installer alternative)
; Run build first so dist\\win-unpacked exists:
;   npm run dist (even if NSIS step fails partially) OR just package manually
; Then run: npm run inno
; Adjust paths/icons as needed.

#define MyAppName "MergePDF"
#define MyAppVersion "0.1.0"
#define MyAppPublisher "Example"
#define MyAppExeName "MergePDF.exe"
#define MySrcDir "dist\\win-unpacked"

[Setup]
AppId={{4F134E61-3A8A-4C09-9D1F-9E6C9B780001}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=no
OutputDir=installer-output
OutputBaseFilename=MergePDFSetup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:"; Flags: unchecked

[Files]
Source: "{#MySrcDir}\\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall skipifsilent
