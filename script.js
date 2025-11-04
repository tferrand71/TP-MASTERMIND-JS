document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('guess-form');
	const input = document.getElementById('guess-input');
	const history = document.getElementById('history');

		// Paramètres de jeu (personnalisables)
		const lengthSelect = document.getElementById('length-select');
		const maxDigitSelect = document.getElementById('maxdigit-select');
		const applySettingsBtn = document.getElementById('apply-settings');

		// Génération de la combinaison secrète selon la longueur et la plage de chiffres
		function generateSecret(len = 4, maxDigit = 6) {
			const out = [];
			for (let i = 0; i < len; i++) {
				out.push(Math.floor(Math.random() * maxDigit) + 1);
			}
			return out;
		}

		// Paramètres courants (valeurs par défaut)
		let currentLength = Number(lengthSelect.value) || 4;
		let currentMaxDigit = Number(maxDigitSelect.value) || 6;

		// La combinaison secrète est stockée localement et reste cachée
		let secret = generateSecret(currentLength, currentMaxDigit);


			const MAX_ATTEMPTS = 12;
			let attemptCount = 0;

			const statusEl = document.getElementById('status');
			const newGameBtn = document.getElementById('new-game');

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
					message += ` La combinaison était : ${secret.join('')}.`;
				}
				setStatus(message, revealSecret);
				disableInput();
				newGameBtn.style.display = 'inline-block';
			}

			function newGame() {
				// lire les paramètres actuels
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
			}

			newGameBtn.addEventListener('click', newGame);

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const value = input.value.trim();

			// Validation dynamique selon les paramètres courants
			const expectedLen = secret.length;
			const maxD = currentMaxDigit;
			const re = new RegExp(`^[1-${maxD}]{${expectedLen}}$`);
			if (!re.test(value)) {
				const err = document.createElement('li');
				err.textContent = `Format invalide — entrez ${expectedLen} chiffres (1-${maxD}), exemple : ${'1'.repeat(expectedLen)}`;
				err.style.color = 'crimson';
				history.appendChild(err);
				return;
			}

			attemptCount += 1;

				const { blacks, whites } = checkGuess(value);

				const pluralBlacks = blacks > 1 ? 's' : '';
				const pluralWhites = whites > 1 ? 's' : '';
				const msg = `Tentative ${attemptCount} : ${value} → ${blacks} bien plac${pluralBlacks}, ${whites} mal plac${pluralWhites}.`;

				const li = document.createElement('li');
				li.textContent = msg;
			// append pour conserver l'ordre chronologique (1..N)
			history.appendChild(li);
	});

	// appliquer les paramètres et démarrer une nouvelle partie quand on clique sur Appliquer
	applySettingsBtn.addEventListener('click', () => {
		newGame();
	});

				if (blacks === 4) {
					endGame(`Bravo — vous avez trouvé la combinaison en ${attemptCount} tentative${attemptCount > 1 ? 's' : ''} !`, false);
					return;
				}

				if (attemptCount >= MAX_ATTEMPTS) {
					endGame('Vous avez atteint le nombre maximal de tentatives. Vous avez perdu.', true);
					return;
				}

				input.value = '';
				input.focus();
		});

	function checkGuess(guessStr) {
		const guess = guessStr.split('').map(c => Number(c));
		let blacks = 0;
		let whites = 0;

		const secretCopy = secret.slice();
		const guessCopy = guess.slice();

		// Comptage des pions noirs (bonne position)
		for (let i = 0; i < 4; i++) {
			if (guessCopy[i] === secretCopy[i]) {
				blacks++;
				secretCopy[i] = guessCopy[i] = null;
			}
		}

		// Comptage des pions blancs (bonne couleur, mauvaise position)
		for (let i = 0; i < 4; i++) {
			if (guessCopy[i] == null) continue;
			const idx = secretCopy.indexOf(guessCopy[i]);
			if (idx !== -1) {
				whites++;
				secretCopy[idx] = null;
			}
		}

		return { blacks, whites };
	}

	// Exemples d'utilisation interne (désactivés):
	// const test = checkGuess('1234');
	// console.log(test);
});

