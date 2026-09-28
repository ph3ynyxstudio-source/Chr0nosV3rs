# STORAGE — ↻hr0nosV3rs

## Objectif

Ce document définit comment les données sont stockées dans le système.

Il décrit :

```txt
où vivent les données
comment elles sont organisées
ce qui est conservé
ce qui est archivé
```

Il ne décrit pas :

```txt
l'interface
les composants
la génération des synthèses
```

---

## Principe

Les données sont stockées localement.

Le système considère le filesystem comme la vérité persistante.

```txt
Filesystem
→ source de vérité
```

---

## Structure générale

```txt
data/
└─ projects/
   └─ {project_id}/
      ├─ raw/
      ├─ weekly/
      ├─ monthly/
      ├─ quarterly/
      └─ archives/
```

---

## Projet

Chaque projet possède son propre espace isolé.

```txt
project_id
→ unité indépendante
```

Aucun projet ne partage ses données avec un autre projet.

---

## Dossier raw/

Contient les données brutes.

Ces données proviennent des sessions utilisateur.

```txt
raw/
→ vérité initiale
```

### Type RawEntry

Structure de référence :

```ts
type RawEntry = {
  timestamp: number;
  dayId: string;
  type: "note" | "action" | "idea" | "event";
  content: string;
  source: "manual" | "ai" | "system";
};
```

---

## Dossier weekly/

Contient les synthèses hebdomadaires validées.

```txt
weekly/
→ mémoire hebdomadaire
```

---

## Dossier monthly/

Contient les synthèses mensuelles validées.

```txt
monthly/
→ mémoire mensuelle
```

---

## Dossier quarterly/

Contient les synthèses trimestrielles validées.

```txt
quarterly/
→ mémoire trimestrielle
```

---

## Dossier archives/

Contient les périodes clôturées.

Exemples :

```txt
week-01.zip
week-02.zip
month-01.zip
```

---

## Cycle de vie d'une donnée

```txt
Session utilisateur
↓
RawEntry
↓
raw/
↓
Synthèse
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

## Règles strictes

### Règle 1

Les données brutes ne sont jamais modifiées automatiquement.

### Règle 2

Une synthèse n'est jamais définitive sans validation humaine.

### Règle 3

Chaque projet reste isolé.

### Règle 4

Le stockage ne prend aucune décision.

### Règle 5

Les archives servent à conserver l'historique.

---

## À éviter

Ne pas mettre dans Storage :

```txt
logique UI
logique Rust
logique Python
validation humaine
```

Storage conserve uniquement les données.

---

## Structure verrouillée

```txt
data/
└─ projects/
   └─ {project_id}/
      ├─ raw/
      ├─ weekly/
      ├─ monthly/
      ├─ quarterly/
      └─ archives/
```

---

## Phrase simple

```txt
Storage conserve.
Il n'interprète pas.
Il ne décide pas.
Il ne transforme pas.
```
