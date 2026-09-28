# LAYOUT — ↻hr0nosV3rs

## Objectif

Ce document définit la structure visuelle principale de l'application.

Il sert à comprendre où modifier le layout global sans toucher aux composants internes.

---

## Fichiers concernés

```txt
src/App.tsx
src/App.css
src/screens/Dashboard/Dashboard.tsx
src/screens/Dashboard/Dashboard.css
```

---

## Rôle des fichiers

### App.tsx

```txt
charge l'écran principal
```

### App.css

```txt
définit les styles globaux
```

### Dashboard.tsx

```txt
assemble les grandes zones du dashboard
```

### Dashboard.css

```txt
définit le layout du dashboard, les grilles, les zones et l'habillage général de l'écran
```

---

## Structure écran

```txt
chronos-app
└─ chronos-shell
   ├─ ThemeToggle (coin haut-droit)
   ├─ main-content
   │  ├─ side-column
   │  │  ├─ text-stylized-zone (logo)
   │  │  └─ project-sidebar
   │  │     ├─ ProjectCard ...
   │  │     └─ NewProjectCard
   │  │
   │  └─ center-visual
   │     └─ SessionShortcut
   │
   └─ footer-status
```

Référence visuelle : `🔒docs/theme clair.png`.

---

## Zones principales

### main-content

Grille 2 colonnes : `side-column` (326px) + `center-visual` (reste).

### side-column

Colonne gauche : logo en haut, sidebar des projets en dessous.

### text-stylized-zone

Zone du logo (hauteur fixe 150px). Le logo déborde volontairement sur la colonne principale ; il a `pointer-events: none`.

### project-sidebar

Liste verticale des `ProjectCard` (300px de large) + `NewProjectCard` en dernier. Hauteur naturelle, plafonnée à 620px, scroll interne au-delà. L'espace en dessous reste libre.

### center-visual

Colonne principale. Contient `SessionShortcut` : nom du projet centré, bouton "Ouvrir la vue hebdomadaire" en haut à droite, deux cartes de 360px (hauteur fixe 560px) centrées avec 120px d'écart. L'espace sous les cartes reste libre.

### footer-status

Ligne d'état discrète en bas de l'application.

---

## Règles strictes

### Règle 1

`App.tsx` reste léger.

### Règle 2

`Dashboard.tsx` assemble les zones du dashboard.

### Règle 3

`App.css` garde les styles globaux.

### Règle 4

`Dashboard.css` gère le layout de l'écran dashboard.

### Règle 5

`App.css` ne doit pas contenir les styles internes de `ProjectCard`.

### Règle 6

Les composants réutilisables doivent être déplacés dans `src/components/`.

### Règle 7

Les composants propres au dashboard peuvent rester dans `src/screens/Dashboard/components/`.

### Règle 8

Les couleurs et valeurs partagées doivent venir de `src/theme/`.

---

## À éviter

Ne pas mélanger dans `App.css` :

```txt
layout global
style interne des composants
tokens de thème
logique visuelle spécifique
```

Ne pas transformer `App.tsx` en fichier géant.

---

## Phrase simple

```txt
App.tsx charge l'écran.
Dashboard.tsx assemble.
Dashboard.css place les zones.
Le thème vit dans src/theme/.
```
