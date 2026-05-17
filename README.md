text

# Chr0nosV3rs

> Journal de progression multi-projets — local-first, human-first.
> Multi-project progression journal — local-first, human-first.

---

## 🇫🇷 Français

### C'est quoi Chr0nosV3rs ?

Chr0nosV3rs est un outil de suivi de progression pour projets multiples,
pensé pour les créateurs, développeurs et travailleurs autonomes qui gèrent
plusieurs univers de travail en parallèle.

L'idée centrale : chaque jour, tu notes ce que tu as accompli et ce que tu
veux faire demain. Semaine après semaine, Chr0nosV3rs compresse, synthétise
et archive ta progression — sans jamais le faire à ta place.

### Philosophie

- **Local-first** — tes données restent sur ton appareil
- **Human-first** — aucune automatisation sans validation consciente
- **Sobre** — fichiers Markdown lisibles par n'importe quel éditeur
- **Pensé pour durer** — structure d'archivage progressive et maîtrisable

### Fonctionnalités

**Vue 7 jours glissante**

- Navigation par slide gauche/droite entre les jours
- Chaque journée contient 2 sections :
  - `Progression` — problèmes rencontrés + solutions trouvées
  - `Intentions` — ce qu'on veut accomplir lors de la prochaine journée
- Mode **split-view** : 2 jours visibles simultanément côte à côte
  (ex: consulter lundi et vendredi en même temps pour transcrire une note oubliée)

**Gestion multi-projets**

- Plusieurs projets gérés en parallèle
- Vue fusionnée — avancement général de tous les projets
- Vue isolée — focus sur un seul projet

**Rituel de synthèse hebdomadaire (obligatoire)**

Le système ne synthétise jamais automatiquement.
L'humain lit, valide, puis déclenche.

ÉTAPE 1 — Lecture des 7 jours
→ Scroll complet obligatoire
→ ☐ J'ai lu mes 7 jours
→ [GÉNÉRER LA SYNTHÈSE]

ÉTAPE 2 — Validation de la synthèse générée
→ Lecture + modification possible
→ ☐ La synthèse reflète bien ma semaine
→ [ACCEPTER & ARCHIVER]
→ ZIP des 7 fichiers journaliers

text

**Architecture de compression par niveaux**

Niveau 1 — Jours
7 fichiers journaliers
↓ rituel semaine validé
synthese-S1.md + archive-jours-S1.zip

Niveau 2 — Semaines
synthese-S1.md à S4.md
↓ rituel mensuel validé
synthese-M1.md + archive-semaines-M1.zip

Niveau 3 — Mois
synthese-M1.md à M3.md
↓ rituel trimestriel validé
synthese-T1.md + archive-mois-T1.zip

Niveau 4 — Manuel
Projet terminé ou version livrée
→ Synthèse maître déclenchée par l'humain

text

**Règle absolue :**
On ne zippe jamais le niveau actuel avant d'avoir créé
et validé la synthèse du niveau supérieur.

**Synthèse assistée par script**

- Générée par un script Python local
- Parsing Markdown + regex + templates
- Interface Flask + HTML (100% local, `localhost:5000`)
- Phase future : modèle IA local via Ollama (Phi-3 Mini)
- Le script ne tourne jamais sans validation humaine préalable

**Structure de fichiers**

Chr0nosV3rs/
├── LunarMood/
│ ├── 2026-05-10.md
│ ├── ...
│ ├── synthese-S1.md
│ └── archive-jours-S1.zip
├── Ph3yNyxStudio/
│ └── ...
└── chr0nos-hub.md

text

### Stack technique

| Composant          | Technologie                  |
| ------------------ | ---------------------------- |
| Scripts            | Python 3.14+                 |
| Interface synthèse | Flask + HTML/CSS/JS          |
| Parsing fichiers   | `pathlib` + `re` + `zipfile` |
| IA locale (future) | Phi-3 Mini Q4_K_M via Ollama |
| Stockage           | Fichiers Markdown locaux     |
| Sync               | Explorateur fichier + GitHub |

### Statut

> 🟡 En conception — vision validée, développement à venir.

Ce projet est un module futur du **PH3YNYX Hub**.

---

## 🇬🇧 English

### What is Chr0nosV3rs?

Chr0nosV3rs is a multi-project progression tracker designed for creators,
developers, and independent workers managing several work universes in parallel.

The core idea: every day, you log what you accomplished and what you want
to do tomorrow. Week after week, Chr0nosV3rs compresses, synthesizes, and
archives your progress — but never without you.

### Philosophy

- **Local-first** — your data stays on your device
- **Human-first** — no automation without conscious validation
- **Minimal** — plain Markdown files readable by any editor
- **Built to last** — progressive archiving structure you always control

### Key Features

**7-day sliding view**

- Slide left/right to navigate between days
- Each day has 2 sections:
  - `Progress` — problems encountered + solutions found
  - `Intentions` — what you want to accomplish the next day
- **Split-view mode** — view 2 days side by side simultaneously

**Multi-project management**

- Multiple projects tracked in parallel
- Merged view — overall progress across all projects
- Isolated view — focus on a single project

**Weekly synthesis ritual (mandatory)**

The system never synthesizes automatically.
You read, validate, then trigger.

STEP 1 — Read your 7 days
→ Full scroll required
→ ☐ I have read my 7 days
→ [GENERATE SYNTHESIS]

STEP 2 — Validate the generated synthesis
→ Read + edit if needed
→ ☐ This synthesis reflects my week
→ [ACCEPT & ARCHIVE]
→ ZIP of the 7 daily files

text

**Compression architecture by levels**

Level 1 — Days → Weekly synthesis + ZIP
Level 2 — Weeks → Monthly synthesis + ZIP
Level 3 — Months → Quarterly synthesis + ZIP
Level 4 — Manual → Master synthesis (project complete / version shipped)

text

**Core rule:**
Never zip the current level before creating and validating
the synthesis of the level above.

### Tech Stack

| Component         | Technology                   |
| ----------------- | ---------------------------- |
| Scripts           | Python 3.14+                 |
| Synthesis UI      | Flask + HTML/CSS/JS          |
| File parsing      | `pathlib` + `re` + `zipfile` |
| Local AI (future) | Phi-3 Mini Q4_K_M via Ollama |
| Storage           | Local Markdown files         |
| Sync              | File explorer + GitHub       |

### Status

> 🟡 In design phase — vision validated, development upcoming.

This project is a future module of the **PH3YNYX Hub**.

---

_Chr0nosV3rs — PH3YNYX Studio © 2026_
