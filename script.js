document.addEventListener('DOMContentLoaded', () => {
const padsContainer = document.getElementById('pads-container');
const stopAllBtn = document.getElementById('stop-all');
const randomBtn = document.getElementById('random');
const renameBtn = document.getElementById('rename');
const renameModal = document.getElementById('rename-modal');
const cancelRenameBtn = document.getElementById('cancel-rename');
const confirmRenameBtn = document.getElementById('confirm-rename');
const sampleIndexInput = document.getElementById('sample-index');
const sampleNameInput = document.getElementById('sample-name');
const audioElements = [];
let isModalOpen = false;

const defaultNames = Array.from({length: 30}, (_, i) => `Sample ${i+1}`);
let sampleNames = JSON.parse(localStorage.getItem('sampleNames')) || defaultNames;

 // Création des pads
for (let i = 1; i <= 30; i++) {
    const pad = document.createElement('button');
    pad.className = 'pad';
    pad.dataset.index = i;
    pad.innerHTML = `
    <div class="pad-number">${i}</div>
    <div class="pad-name">${sampleNames[i-1]}</div>
    `;
    const audio = new Audio(`assets/music/sample(${i}).mp3`);
    audioElements.push(audio);
    pad.addEventListener('click', () => !isModalOpen && playSample(i));
    padsContainer.appendChild(pad);
}

function playSample(i) {
    const audio = audioElements[i-1];
    const pad = document.querySelector(`.pad[data-index="${i}"]`);
    audio.currentTime = 0;
    audio.play();
    pad.classList.add('playing');
    audio.onended = () => pad.classList.remove('playing');
}

stopAllBtn.addEventListener('click', () => {
    audioElements.forEach(a => { a.pause(); a.currentTime = 0; });
    document.querySelectorAll('.pad.playing').forEach(p => p.classList.remove('playing'));
});

randomBtn.addEventListener('click', () => {
    if (!isModalOpen) playSample(Math.floor(Math.random() * 30) + 1);
});

renameBtn.addEventListener('click', () => {
    renameModal.style.display = 'flex';
    isModalOpen = true;
});

cancelRenameBtn.addEventListener('click', () => {
    renameModal.style.display = 'none';
    isModalOpen = false;
});

confirmRenameBtn.addEventListener('click', () => {
    const index = parseInt(sampleIndexInput.value);
    const name = sampleNameInput.value.trim();
    if (index >= 1 && index <= 30 && name) {
    document.querySelector(`.pad[data-index="${index}"] .pad-name`).textContent = name;
    sampleNames[index-1] = name;
    localStorage.setItem('sampleNames', JSON.stringify(sampleNames));
    renameModal.style.display = 'none';
    isModalOpen = false;
    } else {
    alert('Veuillez entrer un numéro valide (1-30) et un nom.');
    }
});

window.addEventListener('click', e => {
    if (e.target === renameModal) {
    renameModal.style.display = 'none';
    isModalOpen = false;
    }
});
});
