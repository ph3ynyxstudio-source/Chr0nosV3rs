# PROJECT FILESYSTEM MAP — ↻hr0nosV3rs

## Objectif

Définir comment les projets sont stockés localement par l'application.

Ce document décrit :

```txt
où vivent les projets
comment ils sont organisés
comment ils sont créés
comment ils sont supprimés
```

Il ne décrit pas :

```txt
l'interface
les composants
les synthèses
```

---

# Principe

↻hr0nosV3rs gère ses propres données.

L'utilisateur n'a pas besoin de manipuler directement les dossiers.

Le filesystem reste la source de vérité.

```txt
Application
↓
Filesystem interne
↓
Données persistantes
```

---

# Emplacement

Les données sont stockées dans l'espace de données de l'application.

Exemple :

```txt
AppData/
└─ ↻hr0nosV3rs/
   └─ data/
```

L'emplacement exact dépend du système d'exploitation.

L'application est responsable de son accès.

---

# Structure générale

```txt
data/
└─ projects/
   ├─ chr0nosvers/
   │  ├─ raw/
   │  ├─ weekly/
   │  ├─ monthly/
   │  ├─ quarterly/
   │  └─ archives/
   │
   └─ lunarmood/
      ├─ raw/
      ├─ weekly/
      ├─ monthly/
      ├─ quarterly/
      └─ archives/
```

---

# projects/

Contient tous les projets.

Chaque dossier représente un projet indépendant.

```txt
projects/
→ liste des projets existants
```

---

# {project_id}/

Contient toutes les données d'un projet.

Exemples :

```txt
chr0nosvers
lunarmood
```

Chaque projet reste totalement isolé.

Aucune donnée n'est partagée entre projets.

---

# raw/

Contient les données brutes.

Exemples :

```txt
raw/
├─ 2026-06-07.md
├─ 2026-06-08.md
└─ 2026-06-09.md
```

Chaque fichier représente une session utilisateur.

Les données brutes restent la référence historique.

---

# weekly/

Contient les synthèses hebdomadaires validées.

Exemples :

```txt
weekly/
├─ week-23.md
├─ week-24.md
└─ week-25.md
```

---

# monthly/

Réserve les synthèses mensuelles validées.

Prévu pour les évolutions futures.

---

# quarterly/

Réserve les synthèses trimestrielles validées.

Prévu pour les évolutions futures.

---

# archives/

Contient les périodes clôturées.

Exemples :

```txt
archives/
├─ week-23.zip
├─ week-24.zip
└─ month-06.zip
```

---

# Création d'un projet

Depuis le Dashboard :

```txt
Nouveau projet
↓
Nom du projet
↓
Validation
↓
Création du projet
```

L'application crée automatiquement :

```txt
{project_id}/
├─ raw/
├─ weekly/
├─ monthly/
├─ quarterly/
└─ archives/
```

---

# Suppression d'un projet

Workflow :

```txt
Projet
↓
Supprimer
↓
Double confirmation
↓
Suppression du projet
```

L'application supprime alors le dossier associé.

---

# Cycle de vie

```txt
Session utilisateur
↓
raw/
↓
Synthèse hebdomadaire
↓
Validation humaine
↓
weekly/
↓
Archivage
↓
archives/
```

---

# Règles strictes

### Règle 1

Le filesystem reste la source de vérité.

### Règle 2

Chaque projet reste isolé.

### Règle 3

Les données brutes ne sont jamais modifiées automatiquement.

### Règle 4

Une synthèse n'est jamais définitive sans validation humaine.

### Règle 5

L'utilisateur n'a pas besoin d'interagir directement avec les dossiers.

---

# MVP actuel

Le MVP utilise principalement :

```txt
projects/
raw/
weekly/
```

Les dossiers :

```txt
monthly/
quarterly/
archives/
```

restent préparés pour la suite mais ne sont pas prioritaires.

---

# Phrase simple

```txt
Chr0 gère ses données localement.
Le filesystem conserve la vérité.
L'humain reste le décideur.
```
