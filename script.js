// script.js — gestion basique des propositions
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('guess-form');
	const input = document.getElementById('guess-input');
	const history = document.getElementById('history');

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const value = input.value.trim();
		if (!value) return;

		// Ajouter la tentative à l'historique
		const li = document.createElement('li');
		li.textContent = value;
		history.prepend(li);

		// Réinitialiser le champ
		input.value = '';
		input.focus();
	});
});

