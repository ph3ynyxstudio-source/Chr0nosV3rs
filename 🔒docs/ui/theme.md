# THEME — ↻hr0nosV3rs

## Objectif

Ce document définit où se trouvent les éléments liés au thème visuel et aux textes d'interface.

Il sert à savoir où aller pour modifier :

```txt
couleurs
tokens
textes visibles
configuration UI
variables globales
```

---

## Fichiers concernés

```txt
src/theme/config.ts
src/theme/design_tokens.ts
src/theme/UI_TERMS.ts
src/App.css
```

---

## Rôle des fichiers

### config.ts

```txt
configuration générale de l'application
```

### design_tokens.ts

```txt
valeurs visuelles partagées
```

### UI_TERMS.ts

```txt
textes visibles dans l'interface
```

### App.css

```txt
variables CSS globales et styles globaux
```

---

## config.ts

Contient les réglages globaux simples.

Exemples :

```txt
flags
mode local
activation/désactivation de comportements
configuration MVP
```

---

## design_tokens.ts

Contient les valeurs visuelles utilisées par les composants.

Exemples :

```txt
couleurs
fonds
accents
textes
espacements
rayons
ombres
```

Règle :

```txt
Toute valeur visuelle réutilisée doit aller ici.
```

---

## UI_TERMS.ts

Contient les textes visibles dans l'application.

Exemples :

```txt
titres
boutons
labels
messages courts
textes d'état
```

Règle :

```txt
Un texte visible réutilisé ne doit pas être dispersé dans App.tsx.
```

---

## App.css

Contient les variables CSS globales et les styles globaux.

Exemples :

```css
:root {
  --bg-app: #030611;
  --bg-card: rgba(8, 14, 28, 0.65);
  --text-primary: #f4f7fb;
  --text-secondary: #7b88a1;
  --accent-blue: #54d6ff;
  --accent-purple: #7e5cff;
}
```

---

## Règles strictes

### Règle 1

Les couleurs principales doivent être centralisées.

### Règle 2

Les textes réutilisés doivent être centralisés.

### Règle 3

Ne pas créer plusieurs sources pour la même valeur.

### Règle 4

Ne pas mettre de logique métier dans `theme/`.

### Règle 5

Ne pas mettre de style de composant dans `theme/`.

### Règle 6

Ne pas mettre de textes UI importants directement dans `App.tsx` si ces textes sont réutilisables.

### Règle 7

Les textes réutilisables vont dans `UI_TERMS.ts`.

### Règle 8

Les textes propres à un écran ou à un composant peuvent rester locaux tant qu'ils ne sont pas mutualisés.

---

## Source de vérité recommandée

```txt
design_tokens.ts
→ source principale des valeurs visuelles

UI_TERMS.ts
→ source principale des textes visibles

config.ts
→ source principale de la configuration simple

App.css
→ application CSS globale des variables et des styles globaux
```

---

## À éviter

Éviter :

```txt
couleurs dupliquées partout
textes dispersés dans plusieurs composants
tokens non utilisés
variables CSS et design_tokens.ts contradictoires
```

---

---

## Thème clair "Aube"

Thème additionnel, optionnel. Le thème sombre reste le défaut de l'application.

Mécanisme :

```txt
attribut data-theme sur <html> (document.documentElement)
→ contrôlé par un state React dans App.tsx
→ persisté en localStorage
```

Tokens (dans `src/App.css`, bloc `:root[data-theme="aube"]`, miroir en TS dans `src/theme/design_tokens.ts` sous `AUBE_THEME_TOKENS`) :

```css
:root[data-theme="aube"] {
  --bg-app: #f6f7fa;
  --bg-card: #ffffff;
  --border-card: #e2e5eb;
  --text-primary: #12151c;
  --text-secondary: #6b7280;
  --accent-blue: #0ea5c4;
  --accent-purple: #6d4fd6;
  --danger: #d64545;
}
```

Bascule : `src/screens/Dashboard/components/ThemeToggle/ThemeToggle.tsx` (coin haut-droit du Dashboard).

Règles d'application :

```txt
fond général uni, pas de dégradé
cartes blanches, bordure fine --border-card, pas de glow
bouton Supprimer discret par défaut, visible au survol
icônes d'édition sans halo coloré
badges en fond gris clair, texte --text-primary
```

Portée : tous les écrans suivent le thème actif. Chaque composant porte ses overrides dans son propre fichier CSS via des blocs `:root[data-theme="aube"] .classe { ... }` :

```txt
Dashboard   → ProjectCard, NewProjectCard, NewProjectOverlay, SessionShortcut, ThemeToggle, Dashboard.css
WeeklyView  → WeeklyView.css, LastSynthesisCard, TodaySessionCard, WeeklyDayCard, SessionOverlay
Overlays    → WeeklySummaryOverlay (réutilise les classes de SessionOverlay)
```

Attention : un fond sombre codé en dur sans override Aube devient illisible en Aube, car le texte suit `--text-primary` (foncé en Aube). Tout nouveau composant doit recevoir ses overrides.

La bascule reste sur le Dashboard uniquement ; la vue hebdomadaire suit le thème choisi.

Logo : le logo a deux variantes selon `theme`, dans `Dashboard.tsx` (`.app-logo`) et `WeeklyView.tsx` (`.weekly-view-logo`) :

```txt
sombre → /assets/TEXTE_Style_officiel_2000x500.png
aube   → /assets/theme clair titre.png
```

Les deux PNG ont de larges marges transparentes et des ratios différents (2000x500 vs 700x394). `.app-logo` recadre chaque image sur le logo lui-même via `object-view-box` (valeurs propres à chaque thème dans `Dashboard.css`) et l'affiche à 447px de large : même taille et même position dans les deux thèmes. `.app-logo` a `pointer-events: none` car il déborde sur la colonne principale.

---

## Phrase simple

```txt
theme/ définit les valeurs.
App.css applique le style global.
Les composants consomment les tokens.
```
