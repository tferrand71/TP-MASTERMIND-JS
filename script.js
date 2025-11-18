document.addEventListener('DOMContentLoaded', () => {

    // Récupération de tous les éléments HTML nécessaires
    const form = document.getElementById('guess-form');
    const input = document.getElementById('guess-input');
    const history = document.getElementById('history');
    const lengthSelect = document.getElementById('length-select');
    const maxDigitSelect = document.getElementById('maxdigit-select');
    const applySettingsBtn = document.getElementById('apply-settings');
    const newGameBtn = document.getElementById('new-game');
    const statusEl = document.getElementById('status');

    //------- Fonction qui génère la combinaison secrète (Mastermind) ----//
    // len = taille de la combinaison, maxDigit = chiffre/couleur maximal autorisé
    function generateSecret(len = 4, maxDigit = 6) {
        const out = [];
        for (let i = 0; i < len; i++) out.push(Math.floor(Math.random() * maxDigit) + 1);
        return out;
    }

    // Initialisation des paramètres de jeu
    let currentLength = Number(lengthSelect.value) || 4;
    let currentMaxDigit = Number(maxDigitSelect.value) || 6;

    // Mode de jeu : chiffres ou couleurs
    const modeDigitsEl = document.getElementById('mode-digits');
    const modeColorsEl = document.getElementById('mode-colors');
    let currentMode = modeColorsEl && modeColorsEl.checked ? 'colors' : 'digits';

    // Noms + codes couleurs possibles
    const COLOR_NAMES = ['Rouge', 'Vert', 'Bleu', 'Jaune', 'Orange', 'Violet', 'Cyan', 'Magenta', 'Marron'];
    const COLOR_CODES = ['#e74c3c', '#27ae60', '#2980b9', '#f1c40f', '#e67e22', '#8e44ad', '#1abc9c', '#ff00ff', '#8b4513'];

    // --- AJOUT MASTERMIND : Musique de victoire (Mastermind Shrek Edition) ---
    // ⚠️ Remplacez le chemin par l'URL de votre fichier audio !
    const victorySound = new Audio("shrek.mp3");

    const legendEl = document.getElementById('color-legend');
    const selectionEl = document.getElementById('selection');
    const clearSelectionBtn = document.getElementById('clear-selection');
    let selection = [];

    //----- Met à jour le champ de saisi à partir de la sélection des couleurs ----//
    function updateInputFromSelection() {
        input.value = selection.join('');
    }

    //---- Affichage visuel de la sélection de couleurs (mode couleurs) ----//
    function renderSelection() {
        if (!selectionEl) return;
        selectionEl.innerHTML = '';

        selection.forEach((d, idx) => {
            const chip = document.createElement('div');
            chip.className = 'chip';

            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.style.background = COLOR_CODES[Number(d) - 1] || '#ddd';

            const text = document.createElement('span');
            text.textContent = COLOR_NAMES[Number(d) - 1] || d;

            // Bouton permettant de retirer une couleur cliquée
            const remove = document.createElement('button');
            remove.className = 'remove';
            remove.type = 'button';
            remove.setAttribute('aria-label', `Retirer ${text.textContent}`);
            remove.textContent = '\u00d7';

            // Action : retirer du tableau puis re-rendre l’affichage
            remove.addEventListener('click', () => {
                selection.splice(idx, 1);
                renderSelection();
                updateInputFromSelection();
            });

            chip.appendChild(dot);
            chip.appendChild(text);
            chip.appendChild(remove);
            selectionEl.appendChild(chip);
        });

        // Affiche bouton "Effacer" uniquement si quelque chose est sélectionné
        if (clearSelectionBtn) clearSelectionBtn.style.display = selection.length ? 'inline-block' : 'none';
    }

    //---- Ajout d'un chiffre/couleur dans la saisie ----//
    function appendDigitToSelection(d) {
        const expectedLen = currentLength || secret.length;
        if (selection.length >= expectedLen) return; // évite dépassement

        selection.push(String(d));
        renderSelection();
        updateInputFromSelection();
    }

    //---- Permet de vider complètement la sélection ----//
    function clearSelection() {
        selection = [];
        renderSelection();
        updateInputFromSelection();
    }
    //I wanna take you somewhere so you know I care
    // But it's so cold, and I don't know where
    // I brought you daffodils on a pretty string
    // But they won't flower like they did last spring
    // And I wanna kiss you, make you feel alright
    // I'm just so tired to share my nights
    // I wanna cry and I wanna love
    // But all my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // Oh-oh
    // Oh
    // Oh-oh, oh-oh
    // Oh-oh-oh, oh-oh
    // And if somebody hurts you, I wanna fight
    // But my hand's been broken one too many times
    // So I'll use my voice, I'll be so fucking rude
    // Words, they always win, but I know I'll lose
    // And I'd sing a song that'd be just ours
    // But I sang 'em all to another heart
    // And I wanna cry, I wanna learn to love
    // But all my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // Ah-oh
    // Oh-oh
    // Oh (oh, need a love, now)
    // Oh (my heart is thinking of)
    // I wanna sing a song that'll be just ours
    // But I sang 'em all to another heart
    // And I wanna cry, I wanna fall in love
    // But all my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // On another love, another love
    // All my tears have been used up
    // Oh-oh
    // Oh-oh

    //---- Affiche la légende correspondant aux couleurs disponibles ----//
    function renderLegend(maxD = currentMaxDigit) {
        if (!legendEl) return;
        legendEl.innerHTML = '';

        for (let i = 1; i <= maxD; i++) {
            // Élément contenant couleur + texte
            const item = document.createElement('div');
            item.style.display = 'inline-flex';
            item.style.alignItems = 'center';
            item.style.gap = '0.4rem';
            item.style.padding = '0.2rem 0.4rem';
            item.style.borderRadius = '6px';
            item.style.background = '#f5f5f5';
            item.style.fontSize = '0.9rem';

            const swatch = document.createElement('span');
            swatch.style.display = 'inline-block';
            swatch.style.width = '18px';
            swatch.style.height = '18px';
            swatch.style.borderRadius = '4px';
            swatch.style.border = '1px solid #ccc';
            swatch.style.background = COLOR_CODES[i - 1] || '#ddd';

            const label = document.createElement('span');
            label.textContent = `${i} = ${COLOR_NAMES[i - 1] || i}`;

            item.appendChild(swatch);
            item.appendChild(label);

            // Accessibilité + sélection de couleur si mode couleurs
            item.dataset.value = String(i);
            item.style.cursor = 'default';
            item.tabIndex = 0;

            item.addEventListener('click', () => {
                if (currentMode === 'colors') appendDigitToSelection(i);
            });
            item.addEventListener('keydown', (ev) => {
                if ((ev.key === 'Enter' || ev.key === ' ') && currentMode === 'colors') {
                    ev.preventDefault();
                    appendDigitToSelection(i);
                }
            });

            legendEl.appendChild(item);
        }
    }

    //---- Génère une nouvelle combinaison secrète ----//
    let secret = generateSecret(currentLength, currentMaxDigit);

    // Nombre maximum de tentatives autorisé
    const MAX_ATTEMPTS = 12;
    let attemptCount = 0;

    //---- Affiche un message (erreur ou statut normal) ----//
    function setStatus(text, isError = false) {
        statusEl.textContent = text;
        statusEl.style.color = isError ? 'crimson' : 'inherit';
    }

    //---- Désactive les champs et la soumission en fin de partie ----//
    function disableInput() {
        input.disabled = true;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
    }

    //---- Réactive la saisie pour une nouvelle partie ----//
    function enableInput() {
        input.disabled = false;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = false;
    }

    //---- Affiche le message de fin + option de révéler la solution ----//
    function endGame(message, revealSecret = false) {
        if (revealSecret) {
            // Adaptation selon mode chiffres / mode couleurs
            if (currentMode === 'colors') {
                const names = secret.map(n => COLOR_NAMES[n - 1] || n).join(' - ');
                message += ` La combinaison était : ${names} (${secret.join('')}).`;
            } else {
                message += ` La combinaison était : ${secret.join('')}.`;
            }
        } else {
            // --- MODIFICATION : Jouer la musique de victoire en cas de réussite ---
            victorySound.play().catch(e => console.error("Erreur de lecture audio (nécessite une interaction utilisateur préalable) :", e));
        }

        setStatus(message, revealSecret);
        disableInput();
        newGameBtn.style.display = 'inline-block';
    }

    //---- Réinitialise toutes les valeurs pour recommencer une partie ----//
    function newGame() {
        // Mise à jour des réglages choisis
        currentLength = Number(lengthSelect.value) || 4;
        currentMaxDigit = Number(maxDigitSelect.value) || 6;

        secret = generateSecret(currentLength, currentMaxDigit);
        attemptCount = 0;

        history.innerHTML = '';
        setStatus('Nouvelle partie démarrée. Bonne chance !');

        // --- MODIFICATION : Arrêter le son de victoire et le remettre au début ---
        victorySound.pause();
        victorySound.currentTime = 0;

        newGameBtn.style.display = 'none';
        enableInput();

        input.value = '';
        input.focus();

        renderLegend(currentMaxDigit);
        clearSelection();

        // Gestion mode chiffres / couleurs
        if (modeColorsEl && modeColorsEl.checked) {
            input.style.display = 'none';
            currentMode = 'colors';
            setStatus('Mode : Couleurs');
            if (selectionEl) selectionEl.style.display = 'flex';
            if (clearSelectionBtn) clearSelectionBtn.style.display = 'none';

        } else {
            input.style.display = '';
            currentMode = 'digits';
            setStatus('Mode : Chiffres');
            if (selectionEl) selectionEl.style.display = 'none';
            if (clearSelectionBtn) clearSelectionBtn.style.display = 'none';
        }
    }

    // Boutons déclencheurs
    newGameBtn.addEventListener('click', newGame);
    applySettingsBtn.addEventListener('click', newGame);

    // Mise à jour de la légende lorsqu'on change le nombre max de couleurs/chiffres
    maxDigitSelect.addEventListener('change', () => {
        const maxD = Number(maxDigitSelect.value) || 6;
        renderLegend(maxD);
    });

    if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', () => clearSelection());

    // Passage mode CHIFFRES → masquage sélection couleurs
    if (modeDigitsEl) modeDigitsEl.addEventListener('change', () => {
        currentMode = 'digits';
        input.style.display = '';
        setStatus('Mode : Chiffres');
        clearSelection();

        if (selectionEl) selectionEl.style.display = 'none';
        if (clearSelectionBtn) clearSelectionBtn.style.display = 'none';
    });

    // Passage mode COULEURS → affichage interface de sélection
    if (modeColorsEl) modeColorsEl.addEventListener('change', () => {
        currentMode = 'colors';
        input.style.display = 'none';
        setStatus('Mode : Couleurs');
        clearSelection();

        if (selectionEl) selectionEl.style.display = 'flex';
        if (clearSelectionBtn) clearSelectionBtn.style.display = 'none';
    });

    // Initialise affichages au chargement de la page
    renderLegend(currentMaxDigit);

    if (currentMode === 'colors') {
        if (selectionEl) selectionEl.style.display = 'flex';
        if (input) input.style.display = 'none';
    } else {
        if (selectionEl) selectionEl.style.display = 'none';
        if (input) input.style.display = '';
    }

    //---- Récupère la saisie utilisateur (selon mode) ----//
    function getSubmissionValue() {
        if (currentMode === 'colors') return selection.join('');
        return input.value.trim();
    }

    //---- Validation d’une tentative ----//
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const value = getSubmissionValue();
        const expectedLen = secret.length;
        const maxD = currentMaxDigit;

        // Vérifie que la saisie respecte le format (longueur + chiffres autorisés)
        const re = new RegExp(`^[1-${maxD}]{${expectedLen}}$`);
        if (!re.test(value)) {
            const err = document.createElement('li');

            // Message adapté au mode
            if (currentMode === 'colors') {
                const mapping = Array.from({ length: maxD }, (_, i) => `${i + 1}=${COLOR_NAMES[i] || i + 1}`).join(', ');
                err.textContent = `Format invalide — entrez ${expectedLen} chiffres (1-${maxD}). Mapping : ${mapping}. Exemple : ${'1'.repeat(expectedLen)}`;
            } else {
                err.textContent = `Format invalide — entrez ${expectedLen} chiffres (1-${maxD}), exemple : ${'1'.repeat(expectedLen)}`;
            }

            err.style.color = 'crimson';
            history.appendChild(err);
            return;
        }

        attemptCount += 1;

        // Calcul du nombre de "bien placés" + "mal placés"
        const { blacks, whites } = checkGuess(value);

        const pluralBlacks = blacks > 1 ? 's' : '';
        const pluralWhites = whites > 1 ? 's' : '';

        const msg = `Tentative ${attemptCount} : ${value} → ${blacks} bien placé${pluralBlacks}, ${whites} mal placé${pluralWhites}.`;

        const li = document.createElement('li');

        // En mode couleurs : afficher aussi les noms des couleurs
        if (currentMode === 'colors') {
            const colors = value.split('').map(ch => COLOR_NAMES[Number(ch) - 1] || ch).join(' - ');
            li.textContent = `${msg} (${colors})`;
        } else {
            li.textContent = msg;
        }

        history.appendChild(li);

        // Victoire
        if (blacks === expectedLen) {
            endGame(`Bravo — vous avez trouvé la combinaison en ${attemptCount} tentative${attemptCount > 1 ? 's' : ''} !`, false);
            return;
        }

        // Défaite
        if (attemptCount >= MAX_ATTEMPTS) {
            endGame('Vous avez atteint le nombre maximal de tentatives. Vous avez perdu.', true);
            return;
        }

        // Remise à zéro selon le mode
        if (currentMode === 'colors') {
            clearSelection();
        } else {
            input.value = '';
            input.focus();
        }
    });

    //---- Fonction de comparaison entre proposition et secret ----//
    function checkGuess(guessStr) {

        // Conversion de la saisie en tableau de nombres
        const guess = guessStr.split('').map(c => Number(c));

        // ➜ Copie de la proposition AVANT modifications internes
        const guessArrInitial = [...guess];

        let blacks = 0; // chiffres bien placés
        let whites = 0; // bons chiffres mais mauvaise position

        // Copies internes utilisées pour détecter correspondances
        const secretCopy = secret.slice();
        const guessCopy = guess.slice();

        // ---------- Étape 1 : compter les "bien placés" ----------
        for (let i = 0; i < secret.length; i++) {
            if (guessCopy[i] === secretCopy[i]) {
                blacks++;
                // On marque les index déjà traités pour éviter double comptage
                secretCopy[i] = guessCopy[i] = null;
            }
        }

        // ---------- Étape 2 : compter les "mal placés" ----------
        for (let i = 0; i < secret.length; i++) {
            if (guessCopy[i] == null) continue; // déjà compté en noir

            const idx = secretCopy.indexOf(guessCopy[i]);
            if (idx !== -1) {
                whites++;
                secretCopy[idx] = null; // retire pour éviter double comptage
            }
        }

        // ----- Zone DEBUG (affichée dans une section cachée du HTML) -----
        const dbgSecret = document.getElementById('debug-secret');
        const dbgGuess = document.getElementById('debug-guess');
        const dbgResult = document.getElementById('debug-result');

        if (dbgSecret && dbgGuess && dbgResult) {
            dbgSecret.textContent = "Secret : " + secret.join(" - ");
            dbgGuess.textContent = "Guess  : " + guessArrInitial.join(" - ");
            dbgResult.textContent = `Résultat → Bien placés : ${blacks} | Mal placés : ${whites}`;
        }

        return { blacks, whites };
    }

});