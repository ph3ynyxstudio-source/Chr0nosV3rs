# CODEX GUIDE — ↻hr0nosV3rs

## Objectif

↻hr0nosV3rs est une application locale de gestion de projets orientée temps et mémoire de progression.

Le système transforme des sessions de travail en mémoire structurée consultable.

L'utilisateur reste toujours le décideur final.

L'application ne prend aucune décision autonome.

---

# MVP ACTUEL

Le MVP est centré sur :

```txt
Dashboard
→ Projets

Sessions quotidiennes
→ Données brutes

Visualisation hebdomadaire

Synthèse hebdomadaire

Validation humaine

Archivage
```

Toute nouvelle proposition doit respecter ce périmètre.

---

# Philosophie du projet

Le système :

```txt
organise
structure
synthétise
archive
```

Le système ne :

```txt
décide pas
ne remplace pas l'humain
ne crée pas d'objectifs automatiquement
ne modifie pas les données sans validation
```

---

# Architecture générale

Flux officiel :

```txt
UI
→ Rust
→ Python
→ Filesystem
→ UI
```

Rôles :

```txt
UI
→ interaction humaine

Rust
→ orchestration

Python
→ transformation

Filesystem
→ stockage
```

---

# Structure du repo

## UI

```txt
src/
```

### Layout principal

```txt
src/App.tsx
src/App.css
```

### Theme

```txt
src/theme/
```

Contient :

```txt
config.ts
design_tokens.ts
UI_TERMS.ts
```

### Components

```txt
src/components/
```

Composants React réutilisables.

### Assets

```txt
src/assets/
```

Images et ressources visuelles.

---

# Documentation

```txt
🔒docs/
```

### Documentation système

```txt
🔒docs/system/
```

### Documentation UI

```txt
🔒docs/ui/
```

### Règles

```txt
🔒docs/rules/
```

### Documentation Codex

```txt
🔒docs/codex/
```

---

# Règles importantes

## Simplicité avant complexité

Toujours privilégier :

```txt
simple
lisible
maintenable
```

Éviter :

```txt
abstractions inutiles
sur-ingénierie
multiplication de couches
```

---

## Séparation des responsabilités

UI :

```txt
affiche
déclenche
```

Rust :

```txt
orchestre
```

Python :

```txt
transforme
```

Filesystem :

```txt
stocke
```

Ne jamais mélanger ces responsabilités.

---

## Documentation

Avant de créer un nouveau document :

se demander :

```txt
L'information existe-t-elle déjà ?
```

Si oui :

mettre à jour le document existant.

Ne pas créer plusieurs documents pour expliquer la même chose.

---

# Ce qu'il faut éviter

Ne pas :

```txt
inventer de nouvelles fonctionnalités
modifier l'architecture sans demande
ajouter des automatisations décisionnelles
créer des systèmes parallèles
```

Ne pas supposer des besoins futurs non demandés.

---

# Comment travailler sur le projet

Quand une modification est demandée :

1. Identifier la zone concernée.
2. Trouver le fichier réel dans src/.
3. Vérifier la documentation associée.
4. Proposer un changement minimal.
5. Attendre validation si le changement impacte la structure.

---

# Référence rapide

Changer le thème :

```txt
src/theme/
```

Changer le layout :

```txt
src/App.tsx
src/App.css
```

Changer un composant :

```txt
src/components/
```

Comprendre l'architecture :

```txt
🔒docs/system/architecture.md
```

Comprendre les règles :

```txt
🔒docs/rules/governance.md
```

Commencer la navigation :

```txt
INDEX.md
```

---

# Phrase finale

↻hr0nosV3rs est un système simple :

```txt
L'humain décide.
Le système organise.
La mémoire reste consultable.
```
