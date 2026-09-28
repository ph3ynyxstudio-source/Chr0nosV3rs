# CODE MAP — ↻hr0nosV3rs

## Objectif

Ce fichier sert à retrouver rapidement où modifier une zone visible de l’application.

Il complète `INDEX.md`.

`INDEX.md` indique où aller par grande section.
`CODE_MAP.md` indique où aller pour des éléments précis.

---

## Règle d’utilisation

Ne pas documenter chaque ligne de code.

Documenter seulement :
- zones visuelles importantes
- composants principaux
- classes CSS importantes
- éléments souvent modifiés

---

## Dashboard

### Écran principal

`DASH-001`
Zone générale du dashboard
Fichier :
`src/screens/Dashboard/Dashboard.tsx`
Styles :
`src/screens/Dashboard/Dashboard.css`

`DASH-002`
Colonne gauche (logo + sidebar)
Classe :
`.side-column`
Fichier :
`src/screens/Dashboard/Dashboard.css`

`DASH-003`
Sidebar des projets (colonne gauche)
Classe :
`.project-sidebar`
Fichier :
`src/screens/Dashboard/Dashboard.css`

---

## ProjectCard

`PC-001`
Carte projet complète
Composant :
`src/components/ProjectCard/ProjectCard.tsx`
Styles :
`src/components/ProjectCard/ProjectCard.css`
Classe :
`.project-card`

`PC-002`
État actif / sélectionné
Fichier :
`src/components/ProjectCard/ProjectCard.css`
Classe :
`.project-card.active`

`PC-003`
Titre du projet
Fichier :
`src/components/ProjectCard/ProjectCard.css`
Classe :
`.project-card h3`

`PC-004`
Texte dernière activité
Composant :
`src/components/ProjectCard/ProjectCard.tsx`
Texte :
`Dernière activité`

---

## Cartes du Dashboard

`DC-003`
Carte dernière synthèse
Composant :
`src/screens/Dashboard/components/LastSynthesisCard/LastSynthesisCard.tsx`
Styles :
`src/screens/Dashboard/components/LastSynthesisCard/LastSynthesisCard.css`

`DC-005`
Carte nouveau projet
Composant :
`src/screens/Dashboard/components/NewProjectCard/NewProjectCard.tsx`
Styles :
`src/screens/Dashboard/components/NewProjectCard/NewProjectCard.css`

`DC-006`
Raccourci de session (zone centrale)
Composant :
`src/screens/Dashboard/components/SessionShortcut/SessionShortcut.tsx`
Styles :
`src/screens/Dashboard/components/SessionShortcut/SessionShortcut.css`
Classe :
`.center-visual`

`DC-007`
Sélecteur de thème (coin haut-droit)
Composant :
`src/screens/Dashboard/components/ThemeToggle/ThemeToggle.tsx`
Styles :
`src/screens/Dashboard/components/ThemeToggle/ThemeToggle.css`

---

## Thème

`THEME-001`
Variables CSS globales
Fichier :
`src/App.css`

`THEME-002`
Tokens visuels
Fichier :
`src/theme/design_tokens.ts`

`THEME-003`
Textes visibles réutilisables
Fichier :
`src/theme/UI_TERMS.ts`

`THEME-004`
Thème clair "Aube" (optionnel, sombre reste le défaut)
Fichier :
`src/App.css` (`:root[data-theme="aube"]`)
Bascule :
`src/screens/Dashboard/components/ThemeToggle/ThemeToggle.tsx`

