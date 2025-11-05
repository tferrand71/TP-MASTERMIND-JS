document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('guess-form');
  const input = document.getElementById('guess-input');
  const history = document.getElementById('history');
  const lengthSelect = document.getElementById('length-select');
  const maxDigitSelect = document.getElementById('maxdigit-select');
  const applySettingsBtn = document.getElementById('apply-settings');
  const newGameBtn = document.getElementById('new-game');
  const statusEl = document.getElementById('status');
  function generateSecret(len = 4, maxDigit = 6) {
    const out = [];
    for (let i = 0; i < len; i++) out.push(Math.floor(Math.random() * maxDigit) + 1);
    return out;
  }
  let currentLength = Number(lengthSelect.value) || 4;
  let currentMaxDigit = Number(maxDigitSelect.value) || 6;
  const modeDigitsEl = document.getElementById('mode-digits');
  const modeColorsEl = document.getElementById('mode-colors');
  let currentMode = modeColorsEl && modeColorsEl.checked ? 'colors' : 'digits';
  const COLOR_NAMES = ['Rouge', 'Vert', 'Bleu', 'Jaune', 'Orange', 'Violet', 'Cyan', 'Magenta', 'Marron'];
  const COLOR_CODES = ['#e74c3c', '#27ae60', '#2980b9', '#f1c40f', '#e67e22', '#8e44ad', '#1abc9c', '#ff00ff', '#8b4513'];
  const legendEl = document.getElementById('color-legend');
  const selectionEl = document.getElementById('selection');
  const clearSelectionBtn = document.getElementById('clear-selection');
  let selection = [];
  function updateInputFromSelection() {
    input.value = selection.join('');
  }
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
      const remove = document.createElement('button');
      remove.className = 'remove';
      remove.type = 'button';
      remove.setAttribute('aria-label', `Retirer ${text.textContent}`);
      remove.textContent = '\u00d7';
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
    if (clearSelectionBtn) clearSelectionBtn.style.display = selection.length ? 'inline-block' : 'none';
  }
  function appendDigitToSelection(d) {
    const expectedLen = currentLength || secret.length;
    if (selection.length >= expectedLen) return;
    selection.push(String(d));
    renderSelection();
    updateInputFromSelection();
  }
  function clearSelection() {
    selection = [];
    renderSelection();
    updateInputFromSelection();
  }
  function renderLegend(maxD = currentMaxDigit) {
    if (!legendEl) return;
    legendEl.innerHTML = '';
    for (let i = 1; i <= maxD; i++) {
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
  let secret = generateSecret(currentLength, currentMaxDigit);
  const MAX_ATTEMPTS = 12;
  let attemptCount = 0;
  function setStatus(text, isError = false) {
    statusEl.textContent = text;
    statusEl.style.color = isError ? 'crimson' : 'inherit';
  }
  function disableInput() {
    input.disabled = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
  }
  function enableInput() {
    input.disabled = false;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = false;
  }
  function endGame(message, revealSecret = false) {
    if (revealSecret) {
      if (currentMode === 'colors') {
        const names = secret.map(n => COLOR_NAMES[n - 1] || n).join(' - ');
        message += ` La combinaison était : ${names} (${secret.join('')}).`;
      } else {
        message += ` La combinaison était : ${secret.join('')}.`;
      }
    }
    setStatus(message, revealSecret);
    disableInput();
    newGameBtn.style.display = 'inline-block';
  }
  function newGame() {
    currentLength = Number(lengthSelect.value) || 4;
    currentMaxDigit = Number(maxDigitSelect.value) || 6;
    secret = generateSecret(currentLength, currentMaxDigit);
    attemptCount = 0;
    history.innerHTML = '';
    setStatus('Nouvelle partie démarrée. Bonne chance !');
    newGameBtn.style.display = 'none';
    enableInput();
    input.value = '';
    input.focus();
    renderLegend(currentMaxDigit);
    clearSelection();
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
  newGameBtn.addEventListener('click', newGame);
  applySettingsBtn.addEventListener('click', newGame);
  maxDigitSelect.addEventListener('change', () => {
    const maxD = Number(maxDigitSelect.value) || 6;
    renderLegend(maxD);
  });
  if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', () => clearSelection());
  if (modeDigitsEl) modeDigitsEl.addEventListener('change', () => {
    currentMode = 'digits';
    input.style.display = '';
    setStatus('Mode : Chiffres');
    clearSelection();
    if (selectionEl) selectionEl.style.display = 'none';
    if (clearSelectionBtn) clearSelectionBtn.style.display = 'none';
  });
  if (modeColorsEl) modeColorsEl.addEventListener('change', () => {
    currentMode = 'colors';
    input.style.display = 'none';
    setStatus('Mode : Couleurs');
    clearSelection();
    if (selectionEl) selectionEl.style.display = 'flex';
    if (clearSelectionBtn) clearSelectionBtn.style.display = 'none';
  });
  renderLegend(currentMaxDigit);
  if (currentMode === 'colors') {
    if (selectionEl) selectionEl.style.display = 'flex';
    if (input) input.style.display = 'none';
  } else {
    if (selectionEl) selectionEl.style.display = 'none';
    if (input) input.style.display = '';
  }
  function getSubmissionValue() {
    if (currentMode === 'colors') return selection.join('');
    return input.value.trim();
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = getSubmissionValue();
    const expectedLen = secret.length;
    const maxD = currentMaxDigit;
    const re = new RegExp(`^[1-${maxD}]{${expectedLen}}$`);
    if (!re.test(value)) {
      const err = document.createElement('li');
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
    const { blacks, whites } = checkGuess(value);
    const pluralBlacks = blacks > 1 ? 's' : '';
    const pluralWhites = whites > 1 ? 's' : '';
    const msg = `Tentative ${attemptCount} : ${value} → ${blacks} bien placé${pluralBlacks}, ${whites} mal placé${pluralWhites}.`;
    const li = document.createElement('li');
    if (currentMode === 'colors') {
      const colors = value.split('').map(ch => COLOR_NAMES[Number(ch) - 1] || ch).join(' - ');
      li.textContent = `${msg} (${colors})`;
    } else {
      li.textContent = msg;
    }
    history.appendChild(li);
    if (blacks === expectedLen) {
      endGame(`Bravo — vous avez trouvé la combinaison en ${attemptCount} tentative${attemptCount > 1 ? 's' : ''} !`, false);
      return;
    }
    if (attemptCount >= MAX_ATTEMPTS) {
      endGame('Vous avez atteint le nombre maximal de tentatives. Vous avez perdu.', true);
      return;
    }
    if (currentMode === 'colors') {
      clearSelection();
    } else {
      input.value = '';
      input.focus();
    }
  });
  function checkGuess(guessStr) {
    const guess = guessStr.split('').map(c => Number(c));
    let blacks = 0;
    let whites = 0;
    const secretCopy = secret.slice();
    const guessCopy = guess.slice();
    for (let i = 0; i < secret.length; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        blacks++;
        secretCopy[i] = guessCopy[i] = null;
      }
    }
    for (let i = 0; i < secret.length; i++) {
      if (guessCopy[i] == null) continue;
      const idx = secretCopy.indexOf(guessCopy[i]);
      if (idx !== -1) {
        whites++;
        secretCopy[idx] = null;
      }
    }
    return { blacks, whites };
  }
});

