document.addEventListener('DOMContentLoaded', function() {
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

    // Charger les noms depuis localStorage si disponibles
    let savedNames = JSON.parse(localStorage.getItem("sampleNames"));
    const defaultNames = [
        "Kick 1", "Kick 2", "Snare", "Clap", "Hi-Hat",
        "Cymbale", "Tom 1", "Tom 2", "Bass", "Synth 1",
        "Synth 2", "Pluck", "Voice", "FX 1", "FX 2",
        "Percussion 1", "Percussion 2", "Chord 1", "Chord 2", "Brass",
        "Strings", "Bell", "Chime", "Stab", "Riser",
        "Transition", "Nature", "Beatbox", "Vocal Cut", "Bass Drop"
    ];
    let sampleNames = savedNames && savedNames.length === 30 ? savedNames : defaultNames;
    
    // Génération des pads
    for (let i = 1; i <= 30; i++) {
        const pad = document.createElement('button');
        pad.className = 'pad';
        pad.dataset.sample = `sample${i}`;
        pad.dataset.index = i-1;
        
        pad.innerHTML = `
            <div class="pad-number">${i}</div>
            <div class="pad-name">${sampleNames[i-1]}</div>
        `;
        
        const audio = new Audio();
        audio.src = `assets/music/sample(${i}).mp3`;
        audioElements.push(audio);
        
        pad.addEventListener('click', function() {
            if (!isModalOpen) playSample(i);
        });
        
        padsContainer.appendChild(pad);
    }
    
    function playSample(index) {
        if (!audioElements[index-1].paused) {
            audioElements[index-1].currentTime = 0;
            return;
        }
        audioElements[index-1].currentTime = 0;
        audioElements[index-1].play();
        
        const pad = document.querySelector(`.pad[data-sample="sample${index}"]`);
        pad.classList.add('playing');
        
        audioElements[index-1].onended = function() {
            pad.classList.remove('playing');
        };
    }
    
    stopAllBtn.addEventListener('click', function() {
        audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        document.querySelectorAll('.pad.playing').forEach(pad => {
            pad.classList.remove('playing');
        });
    });
    
    randomBtn.addEventListener('click', function() {
        if (!isModalOpen) {
            const randomIndex = Math.floor(Math.random() * 30) + 1;
            playSample(randomIndex);
        }
    });
    
    renameBtn.addEventListener('click', function() {
        sampleIndexInput.value = '';
        sampleNameInput.value = '';
        renameModal.style.display = 'flex';
        isModalOpen = true;
    });
    
    cancelRenameBtn.addEventListener('click', function() {
        renameModal.style.display = 'none';
        isModalOpen = false;
    });
    
    confirmRenameBtn.addEventListener('click', function() {
        const sampleIndex = parseInt(sampleIndexInput.value);
        const newName = sampleNameInput.value.trim();
        
        if (sampleIndex && sampleIndex >= 1 && sampleIndex <= 30 && newName) {
            const pad = document.querySelector(`.pad[data-sample="sample${sampleIndex}"]`);
            const padNameElement = pad.querySelector('.pad-name');
            padNameElement.textContent = newName;
            sampleNames[sampleIndex-1] = newName;

            // Sauvegarde dans localStorage
            localStorage.setItem("sampleNames", JSON.stringify(sampleNames));

            renameModal.style.display = 'none';
            isModalOpen = false;
        } else {
            alert("Veuillez entrer un numéro valide (1-30) et un nom pour le sample.");
        }
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === renameModal) {
            renameModal.style.display = 'none';
            isModalOpen = false;
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (isModalOpen) return;
        
        if (e.key >= '1' && e.key <= '9') playSample(parseInt(e.key));
        if (e.keyCode >= 96 && e.keyCode <= 105) playSample(e.keyCode - 96);
    });
    
    sampleIndexInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sampleNameInput.focus();
        }
    });
    
    sampleNameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmRenameBtn.click();
        }
    });
});
