# TP Mastermind

Résumé
-------
Ce dépôt contient une implémentation simple du jeu Mastermind en HTML/CSS/JavaScript (front-end uniquement). Le but du projet est d'offrir un petit jeu local où l'utilisateur doit deviner une combinaison chiffrée secrète. Le projet est conçu pour être pédagogique, simple à lire et à étendre.

Fonctionnalités implémentées
----------------------------
- Génération d'une combinaison secrète aléatoire (chiffres) stockée en mémoire JavaScript, non exposée dans le DOM.
- Saisie utilisateur via un champ texte et validation des propositions.
- Comparaison d'une proposition à la combinaison secrète : calcul du nombre de chiffres bien placés (pions noirs) et du nombre de chiffres corrects mais mal placés (pions blancs).
- Historique dynamique des tentatives affiché à l'écran (ordre chronologique).
- Limite de tentatives (par défaut 12). Si le joueur atteint la limite sans trouver, la partie se termine et la combinaison secrète est révélée.
- Détection de la victoire : blocage des entrées et message de succès quand la combinaison est trouvée.
- Contrôles de difficulté : l'utilisateur peut choisir la longueur de la combinaison (4 à 6) et la plage de chiffres (1–6 ou 1–9). Les paramètres sont appliqués à la génération du secret et à la validation des propositions.
- Bouton "Nouvelle partie" et bouton "Appliquer" pour démarrer une partie avec les paramètres choisis.
- Mode de saisie : chiffres ou couleurs. En mode "Couleurs", chaque chiffre correspond à une couleur (ex. 1=Rouge, 2=Vert, ...), une légende visuelle est affichée et les tentatives montrent également les noms des couleurs.

Fichiers principaux
-------------------

Fichiers principaux
-------------------
- `index.html` — page principale contenant l'UI : champ de proposition, bouton Valider, historique, contrôles de difficulté, zone de statut et bouton Nouvelle partie.
- `script.js` — logique du jeu : génération du secret, validation des propositions, comparaison (fonction `checkGuess`), gestion du compteur d'essais, état de la partie (fin/gagner/perdre) et contrôles de difficulté.
- `style.css` — (facultatif) feuille de styles. Le projet peut fonctionner sans styles, mais il est recommandé d'ajouter un style pour améliorer l'ergonomie.

Légende des couleurs et mode couleurs
------------------------------------
- Le jeu propose un mode "Couleurs" où l'utilisateur entre toujours une séquence de chiffres, mais ces chiffres correspondent à des couleurs prédéfinies (palettes jusqu'à 9 couleurs).
- Une légende visuelle (`#color-legend`) affiche les pastilles, le numéro et le nom de chaque couleur disponible selon la configuration (1 = Rouge, 2 = Vert, ...).
- En cas de défaite, la combinaison révélée affiche aussi les noms des couleurs pour plus de lisibilité.

Comment jouer (utilisateur)
--------------------------
1. Ouvrir `index.html` dans un navigateur web moderne (double-clic ou via la ligne de commande : `open index.html` sur macOS).
2. Choisir la longueur (4, 5 ou 6) et la plage de chiffres (1–6 ou 1–9) si vous souhaitez personnaliser la difficulté, puis cliquer sur "Appliquer".
3. (Optionnel) Choisir le mode de saisie : "Chiffres" ou "Couleurs". En mode "Couleurs", reportez-vous à la légende affichée pour connaître le mapping numéro → couleur.
4. Entrer une proposition valide dans le champ de saisie (ex. `1234` si longueur 4 et chiffres 1–6) et cliquer sur "Valider".
4. L'historique affichera pour chaque tentative un message du type :
   - `Tentative 1 : 1234 → 2 bien placés, 1 mal placé.`
5. En cas de victoire (tous les chiffres bien placés), la partie s'arrête et un message de victoire s'affiche.
6. Si le joueur atteint le nombre maximal de tentatives (12 par défaut) sans trouver, la partie se termine, la combinaison est révélée et les entrées sont bloquées.
7. Cliquer sur "Nouvelle partie" pour recommencer.

Conception et notes techniques
------------------------------
- Le secret est généré par la fonction `generateSecret(len, maxDigit)` et stocké dans une variable locale au script (`secret`). Il n'est pas exposé sur `window` ni dans le DOM.
- La comparaison est réalisée par `checkGuess(guessStr)` :
  - Convertit la chaîne de la proposition en tableau de nombres.
  - Compte d'abord les "blacks" (même chiffre à la même position), en marquant les éléments utilisés.
  - Compte ensuite les "whites" (même chiffre, position différente) en évitant les doubles comptages.
- Validation d'entrée : le format attendu dépend des paramètres (longueur et maxi digit). Une expression régulière est construite dynamiquement pour valider les propositions.
- Historique : les tentatives sont ajoutées à la liste d'historique dans l'ordre chronologique (append), afin d'avoir Tentative 1 en haut.
- Limite d'essais : `MAX_ATTEMPTS` (constante dans `script.js`) par défaut à 12.

Notes sur l'interface couleur
---------------------------
- Les couleurs sont mappées à des codes CSS dans `script.js` pour afficher des swatches dans la légende.
- L'interface reste textuelle pour la saisie (l'utilisateur entre des chiffres) afin de garder une interaction simple ; il est possible d'ajouter une interface visuelle (sélection de pastilles) à la place de la saisie si vous préférez une UX plus graphique.

Débogage et développement
-------------------------
- Si vous développez ou testez, vous pouvez temporairement afficher le secret dans la console en décommentant la ligne `console.debug('SECRET (dev only):', secret);` dans `script.js` (uniquement localement — ne pas laisser en production).
- Pour changer rapidement la limite d'essais, modifiez la constante `MAX_ATTEMPTS` dans `script.js`.

Suggestions d'améliorations possibles
------------------------------------
- Styliser l'interface (`style.css`) : meilleure lisibilité, pions visuels (noir/blanc), animations.
- Ajouter des presets de difficulté (Facile/Moyen/Difficile) qui configurent longueur/plage/nb essais.
- Ajouter un mode multi-joueurs (tour par tour) ou sauvegarde des meilleurs scores.
- Rendre le jeu responsive et accessible (meilleur support clavier, lecture d'écran).
- Extraire la logique (`checkGuess`, `generateSecret`) dans un module testable et ajouter des tests unitaires.

Contact
-------
Pour toute question ou suggestion concernant ce TP, contactez le développeur ou ajoutez une issue sur le dépôt (si versionnée).

Bonne partie !