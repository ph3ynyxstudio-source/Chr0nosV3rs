# ARCHITECTURE — ↻hr0nosV3rs

## Objectif

Ce document définit comment les couches du système communiquent entre elles.

Il ne décrit pas :

```txt
les composants UI
les couleurs
les textes
les données détaillées
```

Il décrit uniquement :

```txt
qui fait quoi
qui parle à qui
comment une action traverse le système
```

---

## Architecture générale

```txt
UI
↓
Rust
↓
Python
↓
Filesystem
↓
Retour UI
```

## Flux principal

```txt
Utilisateur
↓
UI
↓
Rust
↓
Python
↓
Filesystem
↓
Rust
↓
UI
```

---

## Couches du système

### UI Layer

Localisation :

```txt
src/
```

Responsabilités :

```txt
afficher
naviguer
déclencher des actions
présenter les résultats
```

Ne doit jamais :

```txt
calculer les synthèses
gérer la logique métier
prendre des décisions
```

### Rust Layer

Localisation :

```txt
src-tauri/
```

Responsabilités :

```txt
recevoir les actions UI
orchestrer le système
appeler Python
lire et écrire les fichiers
retourner les résultats
```

Ne doit jamais :

```txt
prendre des décisions métier
interpréter les synthèses
contrôler l'interface
```

### Python Layer

Localisation prévue :

```txt
scripts/
```

Responsabilités :

```txt
transformer les données
générer les synthèses
agréger les périodes
préparer les résultats
```

Ne doit jamais :

```txt
modifier l'UI
contrôler le workflow utilisateur
prendre la décision finale
```

### Storage Layer

Localisation :

```txt
data/
```

Responsabilités :

```txt
conserver les données
conserver les synthèses
conserver les archives
```

Ne doit jamais :

```txt
calculer
valider
décider
```

---

## Responsabilités résumées

```txt
UI
→ affiche

Rust
→ orchestre

Python
→ transforme

Filesystem
→ stocke
```

---

## Exemple réel

Création d'une synthèse hebdomadaire :

```txt
Utilisateur
↓
Clique "Générer synthèse"
↓
UI
↓
envoie la demande
↓
Rust
↓
lance weekly.py
↓
Python
↓
analyse les RawEntry
↓
Python
↓
génère la synthèse
↓
Filesystem
↓
sauvegarde le résultat
↓
Rust
↓
lit le résultat
↓
UI
↓
affiche la synthèse
```

---

## Règles strictes

### Règle 1

UI ne calcule rien.

### Règle 2

Rust orchestre uniquement.

### Règle 3

Python transforme uniquement.

### Règle 4

Filesystem conserve uniquement.

### Règle 5

Aucune couche ne décide seule.

La validation finale appartient toujours à l'humain.

---

## À éviter

Ne pas créer :

```txt
UI → Python direct
Python → UI direct
Python → décision autonome
Storage → logique métier
```

Toutes les communications passent par l'orchestration Rust.

---

## Structure actuelle

```txt
src/
src-tauri/
scripts/
data/
docs/
```

---

## Phrase simple

```txt
UI affiche.
Rust orchestre.
Python transforme.
Filesystem conserve.
L'humain décide.
```
