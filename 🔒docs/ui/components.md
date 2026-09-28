# COMPONENTS — ↻hr0nosV3rs

## Règle de structure

Chaque composant réutilisable doit avoir son propre dossier dans `src/components/`.

Exemple :

```txt
src/components/ProjectCard/
  ProjectCard.tsx
  ProjectCard.css
```

Les composants propres à un écran peuvent rester dans cet écran.

Exemple actuel :

```txt
src/screens/Dashboard/components/
  LastSynthesisCard/
  OverviewCard/
  NewProjectCard/
```

---

## Rôle des fichiers

### ProjectCard.tsx

```txt
structure React de la carte projet
```

### ProjectCard.css

```txt
style uniquement de la carte projet
```

### Dashboard/components/

```txt
composants locaux du dashboard, non prévus comme composants globaux réutilisables
```

---

## Structure verrouillée

```txt
src/
  App.tsx              → assemble l'application
  App.css              → styles globaux seulement

  screens/
    Dashboard/
      Dashboard.tsx    → assemble l'écran dashboard
      Dashboard.css    → layout du dashboard
      components/
        ...            → cartes propres au dashboard

  theme/
    config.ts          → flags / config app
    design_tokens.ts   → couleurs, espacements, tailles
    UI_TERMS.ts        → textes visibles

  components/
    ProjectCard/
      ProjectCard.tsx  → structure React de la carte
      ProjectCard.css  → style uniquement de la carte

  assets/
    ...
```

---

## Règles strictes

### Règle 1

`App.tsx` reste léger et charge l'écran principal.

### Règle 2

`Dashboard.tsx` assemble les zones et cartes du dashboard.

### Règle 3

`App.css` garde seulement les styles globaux.

### Règle 4

Un composant garde son style dans son propre `.css`.

### Règle 5

`ProjectCard` reste dans `src/components/ProjectCard/` comme composant métier/global réutilisable.

### Règle 6

Ne pas styliser `.project-card` dans `App.css`.

### Règle 7

Utiliser `.active` pour l'état sélectionné.

### Règle 8

Ne pas utiliser `.is-active`.
