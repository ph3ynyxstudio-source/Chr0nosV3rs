# SYNTHESIS — ↻hr0nosV3rs

## Objectif

Ce document définit comment les données brutes deviennent des synthèses temporelles.

Il décrit :

```txt
génération
validation
clôture
archivage
```

Il ne décrit pas :

```txt
UI
composants
thème
layout
```

---

## Principe

Une synthèse est une représentation structurée d'une période de travail.

Le système produit une proposition.

L'humain valide le résultat.

---

## Cycle général

```txt
RawEntry
↓
Synthèse générée
↓
Relecture humaine
↓
Modification éventuelle
↓
Validation humaine
↓
Archivage
```

---

## Niveaux de synthèse

### Hebdomadaire

Période :

```txt
7 jours
```

Source :

```txt
raw/
```

Destination :

```txt
weekly/
```

### Mensuelle

Période :

```txt
4 semaines
```

Source :

```txt
weekly/
```

Destination :

```txt
monthly/
```

### Trimestrielle

Période :

```txt
3 mois
```

Source :

```txt
monthly/
```

Destination :

```txt
quarterly/
```

---

## MVP actuel

Le MVP est centré sur :

```txt
Synthèse hebdomadaire
```

Les niveaux mensuels et trimestriels existent dans l'architecture mais ne sont pas prioritaires.

---

## Workflow hebdomadaire

### Étape 1

L'utilisateur complète ses sessions.

```txt
Lundi
Mardi
Mercredi
Jeudi
Vendredi
Samedi
Dimanche
```

### Étape 2

Les données sont stockées sous forme de RawEntry.

```txt
raw/
```

### Étape 3

Le moteur de synthèse analyse les données.

```txt
weekly.py
```

La génération peut utiliser les jours déjà écoulés de la semaine active. Le jour
en cours et les jours futurs sont exclus. Si aucune session passée n'existe dans
la semaine active, le moteur utilise la semaine précédente.

### Étape 4

Une proposition de synthèse est générée.

```txt
Synthèse provisoire
```

### Étape 5

L'utilisateur relit la synthèse.

### Étape 6

L'utilisateur peut modifier la synthèse.

### Étape 7

L'utilisateur valide la synthèse.

### Étape 8

La période peut être archivée.

---

## Responsabilités

### Python

Responsable de :

```txt
compiler
analyser
agréger
synthétiser
```

### UI

Responsable de :

```txt
afficher
permettre la relecture
permettre la validation
```

### Humain

Responsable de :

```txt
relire
corriger
valider
```

### Storage

Responsable de :

```txt
conserver
archiver
```

---

## Validation humaine

Règle absolue :

```txt
Aucune synthèse n'est définitive
sans validation humaine.
```

---

## Archivage

Une période archivée devient :

```txt
historique
consultable
conservée
```

L'archivage marque la fin du cycle.

### Double confirmation

Avant archivage :

```txt
Validation
↓
Confirmation finale
↓
Archivage
```

L'utilisateur doit confirmer explicitement.

---

## Ce que le système ne fait pas

Le système ne :

```txt
prend pas de décision
ne valide pas automatiquement
ne reporte pas automatiquement des objectifs
ne modifie pas une synthèse validée
```

---

## Exemple réel

```txt
7 sessions
↓
RawEntry
↓
weekly.py
↓
Synthèse proposée
↓
Relecture
↓
Validation
↓
Archivage ZIP
```

---

## Règles strictes

### Règle 1

La synthèse est une proposition.

### Règle 2

L'humain décide.

### Règle 3

La validation est obligatoire.

### Règle 4

L'archivage clôt la période.

### Règle 5

Les données brutes restent la référence historique.

---

## Relation avec les autres documents

```txt
architecture.md
→ décrit les couches

storage.md
→ décrit les données

synthesis.md
→ décrit la transformation des données
```

---

## Phrase simple

```txt
Les données deviennent une synthèse.
La synthèse devient une mémoire.
L'humain valide chaque étape.
```
