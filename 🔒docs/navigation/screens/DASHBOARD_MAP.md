# DASHBOARD MAP — ↻hr0nosV3rs

## 1. Rôle de l'écran

Le Dashboard est l'écran d'entrée.

Il assemble :
- l'identité visuelle
- la sidebar des projets (colonne gauche)
- le raccourci de session (colonne principale)
- le sélecteur de thème (coin haut-droit)

---

## 2. Fichier assembleur principal

`src/screens/Dashboard/Dashboard.tsx`

---

## 3. Fichier CSS principal

`src/screens/Dashboard/Dashboard.css`

---

## 4. Composants utilisés

- `src/components/ProjectCard/ProjectCard.tsx`
- `src/screens/Dashboard/components/NewProjectCard/NewProjectCard.tsx`
- `src/screens/Dashboard/components/SessionShortcut/SessionShortcut.tsx`
- `src/screens/Dashboard/components/ThemeToggle/ThemeToggle.tsx`
- `src/screens/Dashboard/components/LastSynthesisCard/LastSynthesisCard.tsx`

---

## 5. Blocs CSS importants

- `.chronos-shell` → coque générale de l'écran
- `.main-content` → grille 2 colonnes : colonne gauche / colonne principale
- `.side-column` → colonne gauche (logo + sidebar)
- `.text-stylized-zone` → zone du logo, en haut de la colonne gauche
- `.project-sidebar` → liste scrollable des `ProjectCard` + `NewProjectCard` (max 620px de haut)
- `.center-visual` → colonne principale, contient `SessionShortcut` (raccourci de fin de session)
- `.footer-status` → ligne d'état en bas

Référence visuelle : `🔒docs/theme clair.png`.

---

## 6. Quoi modifier pour changer une zone précise

- Changer la disposition générale : `src/screens/Dashboard/Dashboard.css`
- Changer la sidebar des projets : `.project-sidebar` dans `Dashboard.css`
- Changer une carte projet : `src/components/ProjectCard/`
- Changer le raccourci de session : `src/screens/Dashboard/components/SessionShortcut/`
- Changer le texte ou l'ordre des blocs : `src/screens/Dashboard/Dashboard.tsx`

---

## 7. Ce qu'il ne faut pas toucher

- Ne pas déplacer la logique d'écran dans `App.tsx`
- Ne pas styliser les composants internes du Dashboard dans `src/App.css`
- Ne pas modifier `src/components/ProjectCard/` depuis `Dashboard.css`

---

## 8. Phrase simple de repérage

```txt
Je veux modifier le Dashboard :
je pars de Dashboard.tsx pour la structure
et de Dashboard.css pour le placement global.
```
