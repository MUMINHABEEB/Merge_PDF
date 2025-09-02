const addFilesBtn = document.getElementById('addFilesBtn');
const mergeBtn = document.getElementById('mergeBtn');
const fileListEl = document.getElementById('fileList');
const dropZone = document.getElementById('dropZone');
const searchInput = document.getElementById('search');

let files = []; // { path, name, size }

function bytesToSize(bytes){
  if(bytes === 0) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + sizes[i];
}

function render(){
  fileListEl.innerHTML='';
  const filter = searchInput.value.toLowerCase();
  files.forEach((f, idx) => {
    if(filter && !f.name.toLowerCase().includes(filter)) return;
    const tpl = document.getElementById('file-item-template');
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector('.name').textContent = f.name;
    node.querySelector('.size').textContent = bytesToSize(f.size);
    node.dataset.index = idx;

    node.querySelector('.remove').addEventListener('click', () => {
      files.splice(idx,1); render(); updateState();
    });
    node.querySelector('.up').addEventListener('click', () => { move(idx, -1); });
    node.querySelector('.down').addEventListener('click', () => { move(idx, 1); });

    node.addEventListener('dragstart', e => {
      node.classList.add('dragging');
      e.dataTransfer.setData('text/plain', idx.toString());
    });
    node.addEventListener('dragend', () => node.classList.remove('dragging'));
    node.addEventListener('dragover', e => { e.preventDefault(); });
    node.addEventListener('drop', e => {
      e.preventDefault();
      const from = parseInt(e.dataTransfer.getData('text/plain'),10);
      const to = idx;
      if(from !== to){
        const [m] = files.splice(from,1);
        files.splice(to,0,m);
        render(); updateState();
      }
    });

    fileListEl.appendChild(node);
  });
}

function move(idx, dir){
  const newIdx = idx + dir;
  if(newIdx < 0 || newIdx >= files.length) return;
  const [f] = files.splice(idx,1);
  files.splice(newIdx,0,f);
  render(); updateState();
}

async function addFiles(paths){
  if(!paths || !paths.length) return;
  // In the renderer we cannot read file sizes directly without fs; we approximate with 0 and update later if needed.
  paths.forEach(p => {
    const name = p.split(/[/\\]/).pop();
    if(!files.find(f => f.path === p)) files.push({ path:p, name, size:0 });
  });
  render(); updateState();
}

addFilesBtn.addEventListener('click', async () => {
  const picked = await window.api.pickPdfs();
  addFiles(picked);
});

mergeBtn.addEventListener('click', async () => {
  mergeBtn.disabled = true;
  mergeBtn.textContent = 'Merging...';
  try {
    const result = await window.api.mergePdfs(files.map(f => f.path));
    if(result.saved){
      mergeBtn.textContent = 'Merged!';
      setTimeout(()=> mergeBtn.textContent='Merge', 1500);
    } else {
      mergeBtn.textContent = 'Merge';
    }
  } catch (e){
    alert('Failed: '+ e.message);
    mergeBtn.textContent = 'Merge';
  } finally {
    updateState();
  }
});

searchInput.addEventListener('input', render);

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const paths = [...e.dataTransfer.files].filter(f => f.type==='application/pdf' || f.name.toLowerCase().endsWith('.pdf')).map(f=>f.path);
  addFiles(paths);
});

function updateState(){
  mergeBtn.disabled = files.length < 2;
}

updateState();
