# GOVERNANCE — ↻hr0nosV3rs

## Objectif

Ce document définit les règles de fonctionnement du projet.

Il sert de référence pour :

- le développement
- la documentation
- les contributions
- l'utilisation d'IA (Codex, ChatGPT, etc.)

---

# Principe fondamental

L'humain reste le seul décideur du système.

Le système :

organise
structure
synthétise
archive

```

Le système ne :


décide pas
ne remplace pas l'humain
ne modifie pas les données sans validation
```

---

# MVP LOCK

Le MVP actuel est centré sur :

Dashboard

Gestion de projets

Sessions quotidiennes

Visualisation hebdomadaire

Synthèse hebdomadaire

Validation humaine

Archivage

Toute évolution doit respecter ce périmètre.

---

# Règle d'expansion

Toute nouvelle idée doit être classée comme :

MVP
ou
V2+

Avant toute implémentation.

Aucune fonctionnalité ne doit être ajoutée sans classification.

---

# Simplicité avant complexité

Toujours privilégier :

simple
lisible
maintenable
compréhensible

Éviter :

abstractions inutiles
architecture excessive
sur-ingénierie
multiplication des couches

---

# Séparation des responsabilités

## UI

Responsable de :

affichage
interaction
navigation

Ne doit pas :

calculer
synthétiser
prendre des décisions

---

## Rust

Responsable de :

orchestration
communication
déclenchement des scripts

Ne doit pas :

décider
interpréter les données métier

---

## Python

Responsable de :

transformation
synthèse
agrégation

Ne doit pas :

contrôler l'interface
modifier le workflow utilisateur

---

## Filesystem

Responsable de :

stockage
persistance
archives

Ne doit pas :

calculer
décider
valider

---

# Validation humaine

Toute synthèse doit suivre ce cycle :

Génération
→ Relecture
→ Modification éventuelle
→ Validation humaine
→ Archivage

Aucune synthèse n'est considérée finale sans validation humaine.

---

# Documentation

La documentation doit rester courte et utile.

Avant de créer un nouveau document :

poser la question :

L'information existe-t-elle déjà ?

Si oui :

mettre à jour le document existant.

---

# Organisation documentaire

## INDEX.md

Point d'entrée principal.

Permet de retrouver rapidement une information.

---

## CODEX_GUIDE.md

Point d'entrée pour les IA de développement.

Décrit :

le projet
la structure
les règles
les limites

---

## docs/system/

Décrit :

architecture
stockage
synthèses

---

## docs/ui/

Décrit :

layout
composants
thème

---

## docs/rules/

Décrit :

gouvernance
règles
limites

---

# Utilisation des IA

Les IA peuvent :

proposer
structurer
expliquer
générer du code
documenter

Les IA ne peuvent pas :

prendre des décisions produit
modifier l'architecture sans demande
inventer des besoins
valider à la place de l'humain

---

# Règle de modification

Avant une modification importante :

1. Identifier le besoin.
2. Identifier le fichier concerné.
3. Limiter le changement à la zone concernée.
4. Éviter les effets de bord.
5. Conserver la cohérence du MVP.

---

# Source de vérité

Le code est la réalité.

La documentation existe pour aider à comprendre le code.

En cas de contradiction :

Code
↓
Documentation
↓
Interprétation

La documentation doit être mise à jour si le code change.

---

# Phrase finale

L'humain décide.
Le système organise.
La documentation guide.
Le code exécute.
