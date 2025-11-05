# TP Mastermind

## Résumé
Jeu Mastermind simple et autonome (front-end) écrit en HTML/CSS/JavaScript : l'objectif est de deviner une combinaison secrète générée aléatoirement.

## Fonctionnalités implémentées
- Génération d'une combinaison secrète (configurable : longueur et plage de chiffres).
- Saisie et validation des propositions, comparaison (bien placés / mal placés).
- Historique des tentatives, détection de victoire et gestion de la défaite (limite d'essais).
- Mode "Couleurs" avec légende visuelle et pastilles cliquables pour composer la proposition.

## Fichiers principaux
- `index.html` — interface utilisateur et structure de la page.
- `script.js` — logique du jeu : génération du secret, comparaison, gestion des tentatives et UI dynamique.
- `style.css` — styles visuels, thème chaleureux et responsive.

## Légende des couleurs et mode couleurs
En mode "Couleurs", chaque chiffre représente une couleur (1 = Rouge, 2 = Vert, ...). Une légende graphique montre les pastilles disponibles et leur numéro pour faciliter la saisie.

## Comment jouer (utilisateur)
1. Ouvrir `index.html` dans un navigateur.
2. Choisir la longueur et la plage (1–6 ou 1–9), sélectionner le mode (Chiffres ou Couleurs) et cliquer sur "Appliquer".
3. Composer une proposition (saisie directe en mode Chiffres, ou cliquer les pastilles en mode Couleurs), puis valider.

## Notes sur l'interface couleur
Les pastilles sont cliquables et accessibles au clavier ; en mode Couleurs le champ texte est masqué et la sélection visuelle (chips) constitue la proposition envoyée.
