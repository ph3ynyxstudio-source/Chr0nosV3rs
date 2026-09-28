# NOTEBOOKLM CONTEXT — Chr0 / ↻hr0nosV3rs

Document préparé pour fournir à NotebookLM une source de contexte claire sur le projet Chr0.

Date de préparation : 2026-06-15

Ce document synthétise l'état du dépôt local, la documentation officielle, les règles du projet et l'implémentation actuelle.

---

## 1. Identité du projet

Nom du dépôt : `↻hr0nosV3rs`

Nom courant dans l'interface et les discussions : `Chr0`, `Chr0nosVers`, `↻hr0nosV3rs`

Nature du projet : application locale de suivi de projets orientée temps, mémoire et synthèse.

Idée centrale :

```txt
L'humain décide.
Le système organise.
La mémoire reste consultable.
```

Chr0 sert à transformer des sessions de travail quotidiennes en mémoire structurée. Le système aide à suivre des projets, conserver l'historique, générer des synthèses temporelles et archiver les périodes terminées. Il ne doit pas remplacer la décision humaine.

---

## 2. Vision produit

Chr0 est pensé comme un cockpit local de progression.

Il aide à :

- suivre plusieurs projets indépendants ;
- écrire ou conserver des sessions de travail quotidiennes ;
- visualiser une semaine de travail ;
- générer une proposition de synthèse hebdomadaire ;
- relire, corriger et valider humainement les synthèses ;
- conserver une mémoire exploitable dans le temps.

Le projet insiste sur la souveraineté locale :

- application locale ;
- données stockées sur le filesystem ;
- pas de décision autonome ;
- pas de validation automatique ;
- l'utilisateur reste le décideur final.

---

## 3. MVP actuel

Le MVP est centré sur :

- Dashboard ;
- gestion de projets ;
- sessions quotidiennes ;
- visualisation hebdomadaire ;
- synthèse hebdomadaire ;
- validation humaine ;
- archivage prévu, mais pas encore coeur de l'implémentation.

Toute nouvelle idée doit être classée avant implémentation :

```txt
MVP
ou
V2+
```

Aucune fonctionnalité ne doit être ajoutée sans respecter ce périmètre.

---

## 4. Principe fondamental

Le système peut :

- organiser ;
- structurer ;
- synthétiser ;
- archiver ;
- proposer.

Le système ne doit pas :

- décider ;
- remplacer l'humain ;
- valider automatiquement ;
- modifier les données sans validation ;
- créer des objectifs automatiquement ;
- inventer des besoins non demandés.

Phrase de référence :

```txt
L'humain décide.
Le système organise.
La documentation guide.
Le code exécute.
```

---

## 5. Architecture officielle

Flux officiel :

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

Ou, vu depuis l'utilisateur :

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

Responsabilités :

- UI : affiche, permet l'interaction, déclenche les actions, présente les résultats.
- Rust : orchestre, lit et écrit les fichiers, appelle Python, retourne les résultats à l'UI.
- Python : transforme les données, génère les synthèses, agrège les périodes.
- Filesystem : conserve les données, les synthèses et les archives.
- Humain : relit, corrige, valide et décide.

Règles de séparation :

- UI ne calcule pas les synthèses.
- Rust orchestre, mais ne décide pas.
- Python transforme, mais ne contrôle pas le workflow utilisateur.
- Filesystem conserve, mais n'interprète pas.
- Aucune couche ne décide seule.

---

## 6. Stack technique

Application :

- React 19 ;
- TypeScript ;
- Vite ;
- Tauri 2 ;
- Rust côté orchestration locale ;
- Python pour les synthèses ;
- stockage local par fichiers.

Scripts npm :

```txt
npm run dev      → lance Vite
npm run build    → tsc + vite build
npm run preview  → preview Vite
npm run tauri    → commandes Tauri
```

Fichiers techniques importants :

- `package.json` : scripts et dépendances JS.
- `vite.config.ts` : configuration Vite.
- `src/main.tsx` : point d'entrée React.
- `src/App.tsx` : orchestration UI principale.
- `src-tauri/src/lib.rs` : commandes Tauri et accès filesystem.
- `src-tauri/src/runner.rs` : exécution du script Python.
- `scripts/weekly.py` : génération de synthèse hebdomadaire.

---

## 7. Documentation officielle

Point d'entrée :

```txt
INDEX.md
```

Documentation officielle actuelle :

```txt
🔒docs/
```

Documents importants :

- `🔒docs/codex/CODEX_GUIDE.md` : contexte pour les IA de développement.
- `🔒docs/system/architecture.md` : architecture des couches.
- `🔒docs/system/storage.md` : structure de stockage.
- `🔒docs/system/synthesis.md` : logique des synthèses.
- `🔒docs/system/PROJECT_FILESYSTEM_MAP.md` : organisation locale des projets.
- `🔒docs/ui/layout.md` : structure visuelle principale.
- `🔒docs/ui/components.md` : organisation des composants.
- `🔒docs/ui/theme.md` : thème, tokens et textes UI.
- `🔒docs/rules/governance.md` : règles de gouvernance.
- `🔒docs/navigation/CODE_MAP.md` : carte rapide des zones de code.
- `🔒docs/navigation/screens/DASHBOARD_MAP.md` : carte du Dashboard.
- `🔒docs/navigation/screens/WEEKLY_VIEW_MAP.md` : carte de WeeklyView.
- `🔒docs/navigation/screens/SESSION_OVERLAY_MAP.md` : carte de SessionOverlay.

Règle de navigation :

```txt
Je cherche quoi ?
→ Je regarde dans INDEX.md
→ Je vais directement au bon fichier
```

---

## 8. Organisation actuelle du dépôt

Structure importante :

```txt
src/
  App.tsx
  App.css
  main.tsx

  storage/
    projectStorage.ts

  theme/
    config.ts
    design_tokens.ts
    UI_TERMS.ts

  components/
    ProjectCard/

  screens/
    Dashboard/
    WeeklyView/

public/
  assets/

src-tauri/
  src/
    lib.rs
    runner.rs

scripts/
  weekly.py
  monthly.py
  quarterly.py

data/
  projects/

🔒docs/
```

Note : `monthly.py` et `quarterly.py` sont actuellement des placeholders. Le vrai moteur de synthèse fonctionnel du MVP est `weekly.py`.

---

## 9. Dashboard

Rôle :

Le Dashboard est l'écran d'entrée. Il assemble :

- identité visuelle ;
- logo ;
- sidebar des projets (colonne gauche, `ProjectCard` + `NewProjectCard`) ;
- raccourci de session (colonne principale, `SessionShortcut`) ;
- sélecteur de thème (coin haut-droit, `ThemeToggle`) ;
- footer local/sécurité/souveraineté.

Fichiers principaux :

- `src/screens/Dashboard/Dashboard.tsx`
- `src/screens/Dashboard/Dashboard.css`

Composants utilisés :

- `src/components/ProjectCard/ProjectCard.tsx`
- `src/screens/Dashboard/components/NewProjectCard/NewProjectCard.tsx`
- `src/screens/Dashboard/components/SessionShortcut/SessionShortcut.tsx`
- `src/screens/Dashboard/components/ThemeToggle/ThemeToggle.tsx`
- `src/screens/Dashboard/components/NewProjectOverlay/NewProjectOverlay.tsx`
- `src/screens/Dashboard/components/WeeklySummaryOverlay/WeeklySummaryOverlay.tsx`
- `src/screens/Dashboard/components/LastSynthesisCard/LastSynthesisCard.tsx`

Blocs CSS structurants :

- `.chronos-shell`
- `.main-content` (grille : colonne gauche 326px + colonne principale)
- `.side-column` (logo en haut, sidebar des projets en dessous)
- `.text-stylized-zone`
- `.project-sidebar` (max 620px, scroll interne)
- `.center-visual` (`SessionShortcut`)
- `.footer-status`

Référence visuelle du layout : `🔒docs/theme clair.png`.

Composition visuelle actuelle :

- canvas verrouillé ;
- rendu sombre, néon, cyan/violet ;
- grand visuel central ;
- colonne de widgets à droite ;
- rangée basse de cartes projets ;
- volonté de préserver la composition existante plutôt que de refondre.

---

## 10. Dashboard Lock System

Le Dashboard utilise un canvas verrouillé avec scale global.

Fichiers :

- `src/App.tsx`
- `src/App.css`

Valeurs actuelles :

```ts
const DASHBOARD_WIDTH = 1620;
const DASHBOARD_HEIGHT = 900;
```

CSS correspondant :

```css
.dashboard-lock-canvas {
  width: 1620px;
  height: 900px;
}
```

Calcul du scale :

```ts
Math.min(
  1,
  window.innerWidth / DASHBOARD_WIDTH,
  window.innerHeight / DASHBOARD_HEIGHT,
)
```

Raison de ce choix :

Le MVP ne contient pas encore d'assistant intégré. Le Dashboard doit donc rester utilisable en split view avec ChatGPT, Codex ou un assistant externe. La référence temporaire `1620x900` est plus adaptée que `1920x1080` pour cet usage.

---

## 11. Projets

Le type `Project` est défini dans :

```txt
src/screens/Dashboard/projects.ts
```

Un projet contient notamment :

- id ;
- nom ;
- dernière activité ;
- progression ;
- objectif en semaines ;
- semaine courante ;
- description ;
- données hebdomadaires ;
- sessions raw ;
- état de synthèse hebdomadaire ;
- synthèse hebdomadaire optionnelle.

Projet initial :

```txt
id: chr0nosvers
name: Chr0nosVers
```

Limite MVP :

```ts
const MVP_MAX_PROJECTS = 10;
```

Gestion actuelle :

- création via overlay : nom + description courte (pas d'objectif demandé ; objectif par défaut de 12 semaines dans les métadonnées) ;
- édition du nom uniquement ;
- suppression avec double confirmation ;
- impossibilité de supprimer le dernier projet ;
- progression calculée selon la semaine de projet courante et l'objectif en semaines (conservée dans les données, plus affichée dans l'interface) ;
- chargement des projets existants depuis le stockage Tauri au démarrage.

---

## 12. ProjectCard

Fichiers :

- `src/components/ProjectCard/ProjectCard.tsx`
- `src/components/ProjectCard/ProjectCard.css`

Rôle :

Carte réutilisable de projet. Elle affiche :

- nom ;
- dernière activité ;
- bouton modifier ;
- bouton supprimer si autorisé ;
- état actif via `.active`.

Règles importantes :

- `ProjectCard` reste dans `src/components/ProjectCard/` parce que c'est un composant métier réutilisable.
- Ne pas styliser `.project-card` dans `App.css`.
- Utiliser `.active` pour l'état sélectionné.
- Ne pas utiliser `.is-active`.

---

## 13. WeeklyView

Rôle :

WeeklyView affiche la semaine active ou consultée d'un projet.

Fichiers :

- `src/screens/WeeklyView/WeeklyView.tsx`
- `src/screens/WeeklyView/WeeklyView.css`

Composants :

- `LastSynthesisCard`
- `WeeklyDayCard`
- `TodaySessionCard`
- `SessionOverlay`
- `WeeklySummaryOverlay`

Fonctions principales :

- afficher la semaine ;
- naviguer vers la semaine précédente ou suivante ;
- empêcher la navigation vers le futur ;
- ouvrir jusqu'à deux sessions en même temps ;
- ouvrir la session du jour ;
- sauvegarder le contenu Markdown brut ;
- revenir au Dashboard.

Blocs CSS importants :

- `.weekly-view-shell`
- `.weekly-view-header`
- `.weekly-view-content`
- `.weekly-board`
- `.weekly-days-grid`

Règle de structure :

WeeklyView ne doit pas devenir une page indépendante séparée de l'application. Elle est montée depuis `App.tsx` comme écran actif.

---

## 14. SessionOverlay

Fichiers :

- `src/screens/WeeklyView/components/SessionOverlay/SessionOverlay.tsx`
- `src/screens/WeeklyView/components/SessionOverlay/SessionOverlay.css`

Rôle :

Overlay ouvert au-dessus de WeeklyView pour consulter ou éditer une ou deux sessions.

Comportement :

- WeeklyView reste visible derrière ;
- fond blur et assombri ;
- rangée de mini-cartes jours ;
- panneaux centraux de sessions ;
- jusqu'à deux sessions ouvertes ;
- sauvegarde du Markdown brut ;
- fermeture individuelle ou globale.

Limites :

- si aucun fichier raw n'existe pour une journée, la session affiche un état vide ;
- la sauvegarde nécessite un `rawDateId`, donc un fichier raw existant.

---

## 15. Session quotidienne et prompt officiel

Fichier :

```txt
src/screens/WeeklyView/components/TodaySessionCard/TodaySessionCard.tsx
```

TodaySessionCard permet :

- d'ouvrir la session du jour ;
- de copier le prompt officiel de session ;
- d'afficher la description courte du projet.

Le prompt officiel demande à l'assistant externe de produire une synthèse de session concise et factuelle.

Format demandé :

```txt
# 📌 Contexte
# ✅ Réalisé
# 💡 Découvertes
# 🚧 Blocages
# ➡️ Suite
# 🧭 Résumé en une phrase
```

Règles du prompt :

- ne pas inventer ;
- ne pas transformer une idée en décision validée ;
- distinguer réalisations et réflexions ;
- écrire simplement ;
- produire une mémoire relisible plusieurs mois plus tard.

---

## 16. Stockage local

Principe :

Le filesystem est la source de vérité persistante.

Structure officielle :

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

Rôle des dossiers :

- `raw/` : sessions utilisateur brutes, un fichier Markdown par jour.
- `weekly/` : synthèses hebdomadaires.
- `monthly/` : synthèses mensuelles futures.
- `quarterly/` : synthèses trimestrielles futures.
- `archives/` : périodes clôturées futures.

Cycle :

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

En développement, le dépôt contient :

```txt
data/projects/chr0nosvers/raw/
```

avec des sessions Markdown datées, notamment :

- `2026-06-07.md`
- `2026-06-08.md`
- `2026-06-09.md`
- `2026-06-10.md`
- `2026-06-11.md`
- `2026-06-12.md`
- `2026-06-15.md`

La version installée utilise un stockage indépendant du dépôt, sous AppData :

```txt
C:\Users\<Utilisateur>\AppData\Local\chronosvers\data\projects\
```

---

## 17. Pont UI vers stockage

Fichier :

```txt
src/storage/projectStorage.ts
```

Ce fichier expose les fonctions UI qui appellent Tauri :

- `createProjectStorage`
- `deleteProjectStorage`
- `ensureProjectRawSession`
- `listProjectStorages`
- `readProjectRawSessions`
- `saveProjectRawSession`
- `generateWeeklySummary`
- `readWeeklySummary`

Point important :

Les écritures sont disponibles seulement dans le runtime Tauri. Hors Tauri, l'application ne peut pas créer ou sauvegarder de sessions. En mode navigateur/Vite, elle lit uniquement les sessions initiales de `chr0nosvers` comme fallback.

---

## 18. Commandes Tauri

Fichier :

```txt
src-tauri/src/lib.rs
```

Commandes exposées :

- `create_project_storage`
- `delete_project_storage`
- `ensure_project_raw_session`
- `list_project_storages`
- `read_project_raw_sessions`
- `save_project_raw_session`
- `generate_weekly_summary`
- `read_weekly_summary`

Comportements importants :

- validation du `project_id` pour éviter les caractères interdits ;
- validation du `day_id` au format `YYYY-MM-DD` ;
- création automatique des sous-dossiers projet ;
- création automatique d'un template Markdown vide pour la session du jour ;
- lecture triée des sessions raw ;
- suppression du dossier projet lors de la suppression ;
- préparation d'un dossier temporaire pour la génération weekly ;
- suppression du dossier temporaire après génération.

---

## 19. Template de session raw

Les sessions créées par Tauri utilisent un template Markdown.

Sections :

```txt
# 📌 Contexte
# ✅ Réalisé
# 💡 Découvertes
# 📚 Apprentissages
# 🚧 Blocages
# ➡️ Suite
# 🧭 Résumé en une phrase
```

Le template inclut aussi des lignes de guide pour les apprentissages :

```txt
Capacités observées aujourd'hui (optionnel) :
- Analyse
- Documentation
- Débogage
- Organisation
- Communication
- Créativité
- Recherche
- Résolution de problème
```

Ces lignes de template sont ignorées par la détection de contenu significatif.

---

## 20. Détection de contenu significatif

La logique existe à deux endroits :

- TypeScript : `src/screens/Dashboard/projects.ts`
- Rust : `src-tauri/src/lib.rs`

Une session n'est pas considérée comme significative si elle ne contient que :

- la date ;
- les titres de sections vides ;
- les lignes de guide du template ;
- des puces vides.

Cette détection sert à :

- calculer les journées complétées ;
- déterminer si une synthèse hebdomadaire peut être générée ;
- filtrer les sessions vides avant d'appeler Python.

---

## 21. Synthèse hebdomadaire

Documentation :

```txt
🔒docs/system/synthesis.md
```

Moteur actuel :

```txt
scripts/weekly.py
```

Runner Rust :

```txt
src-tauri/src/runner.rs
```

Flux :

```txt
Utilisateur clique "Générer synthèse"
↓
UI appelle generateWeeklySummary(projectId)
↓
Tauri prépare les sessions de la semaine précédente
↓
Rust lance scripts/weekly.py
↓
Python lit les Markdown
↓
Python génère weekly_summary.json
↓
Rust enrichit les métadonnées
↓
UI affiche la synthèse comme Proposition
```

Le script Python produit un JSON avec :

- `meta.created_at`
- `meta.session_count`
- `summary`
- `progression`
- `achievements`
- `blockers`
- `resolutions`
- `discoveries`
- `learnings`
- `next`
- `notes`

Rust enrichit ensuite :

- `expected_session_count`
- `is_partial`

La synthèse est une proposition. Elle n'est jamais définitive sans validation humaine.

---

## 22. Règle de semaine précédente

La génération hebdomadaire utilise les fichiers raw de la semaine précédente.

La semaine est calculée de dimanche à samedi.

Exemple testé :

```txt
Si aujourd'hui est dimanche 2026-06-14,
la semaine précédente est 2026-06-07 → 2026-06-13.
```

La génération accepte les semaines partielles si au moins une session significative existe. Le JSON enrichi indique alors que la synthèse est partielle.

Si aucune session significative n'existe pour la semaine précédente, l'erreur affichée est :

```txt
Aucune session trouvée pour la semaine précédente. Ajoutez au moins une session pour générer une synthèse.
```

---

## 23. WeeklySummaryOverlay

Fichier :

```txt
src/screens/Dashboard/components/WeeklySummaryOverlay/WeeklySummaryOverlay.tsx
```

Rôle :

Afficher la synthèse hebdomadaire dans un overlay réutilisant le style de SessionOverlay.

Sections affichées :

- Résumé ;
- Progression ;
- Blocages ;
- Résolutions ;
- Apprentissages ;
- Suite.

Si la synthèse est partielle, l'overlay affiche :

```txt
Synthèse partielle — X / 7 sessions utilisées
```

Statut affiché :

```txt
Proposition
En relecture
Validée
```

Note importante :

Le projet prévoit la validation humaine et l'archivage, mais l'overlay actuel sert surtout à consulter la proposition générée.

---

## 24. État des synthèses mensuelles et trimestrielles

Documents :

- `🔒docs/system/synthesis.md`
- `🔒docs/system/storage.md`

Fichiers :

- `scripts/monthly.py`
- `scripts/quarterly.py`

État actuel :

- les niveaux mensuels et trimestriels existent dans l'architecture ;
- les dossiers `monthly/` et `quarterly/` sont créés pour chaque projet ;
- les scripts sont des placeholders ;
- le MVP est centré sur la synthèse hebdomadaire.

---

## 25. Assets visuels officiels

Les maquettes et assets visuels sont des références officielles.

Fichiers importants :

```txt
public/assets/TEXTE_Style_officiel_2000x500.png
public/assets/Dashboard-asset.png
public/assets/UI-Dashboard.jpg
public/assets/UI-Sessions-hebdo.png
public/assets/UI-Sessions-hebdo-Active.png
public/assets/App-icon_1024_officiel.png
public/assets/Favicon.png
```

Usage :

- `TEXTE_Style_officiel_2000x500.png` : logo/texte CHR0NOSV3RS.
- `Dashboard-asset.png` : visuel central sablier/phénix (retiré du Dashboard pour l'instant, fichier conservé).
- `UI-Dashboard.jpg` : référence visuelle du Dashboard.
- `UI-Sessions-hebdo.png` et `UI-Sessions-hebdo-Active.png` : références de l'écran hebdomadaire.
- `App-icon_1024_officiel.png` et `Favicon.png` : identité d'application.

Règle :

Ne pas réinventer l'interface si une maquette existe. Adapter l'implémentation vers la maquette.

---

## 26. Direction artistique

Style actuel :

- fond très sombre ;
- ambiance cockpit local ;
- accents cyan et violet ;
- effets néon ;
- cartes translucides ;
- identité sablier/phénix ;
- sentiment de mémoire, temps, progression et souveraineté numérique.

Variables globales principales dans `src/App.css` :

```css
--bg-app: #030611;
--bg-card: rgba(8, 14, 28, 0.65);
--text-primary: #f4f7fb;
--text-secondary: #7b88a1;
--accent-blue: #54d6ff;
--accent-purple: #7e5cff;
```

Tokens dans `src/theme/design_tokens.ts` :

- couleurs de fond ;
- couleurs de texte ;
- accents bleu/violet.

Thème clair optionnel "Aube" : sombre reste le défaut. Bascule via `data-theme` sur `<html>`, tokens dans `:root[data-theme="aube"]` (`src/App.css`) et `AUBE_THEME_TOKENS` (`src/theme/design_tokens.ts`), sélecteur `ThemeToggle` en haut-droit du Dashboard. Voir `🔒docs/ui/theme.md`.

Règles :

- préserver la direction artistique existante ;
- ajuster d'abord proportions, espacements et alignements ;
- éviter les refontes ;
- ne pas remplacer une décision visuelle par une préférence personnelle.

---

## 27. Thème et textes UI

Fichiers :

- `src/theme/config.ts`
- `src/theme/design_tokens.ts`
- `src/theme/UI_TERMS.ts`
- `src/App.css`

`UI_TERMS.ts` contient des textes réutilisables comme :

- `Vue globale`
- `Mes projets`
- `Nouveau projet`
- `Cockpit`
- `Progression`
- `Intentions`
- `Mode local`
- `Données sécurisées`
- `Données locales privées`

`config.ts` contient :

```ts
export const USE_RUST = false;
```

Attention :

Cette constante existe, mais l'implémentation actuelle détecte surtout Tauri via `window.__TAURI_INTERNALS__` dans `projectStorage.ts`. `USE_RUST` n'est pas le point central du comportement de stockage actuel.

---

## 28. Règles de modification importantes

Avant toute modification importante :

1. Lire `INDEX.md`.
2. Vérifier la documentation associée dans `🔒docs/`.
3. Vérifier les assets/maquettes si la tâche est visuelle.
4. Lire le code existant.
5. Limiter le changement au périmètre demandé.

Philosophie :

- préserver le travail existant ;
- préférer les évolutions progressives ;
- préférer les petites modifications vérifiables ;
- éviter les refontes ;
- éviter les abstractions inutiles ;
- ne pas déplacer, renommer ou supprimer des fichiers sans demande explicite.

Documentation :

- ne pas créer plusieurs documents qui expliquent la même chose ;
- mettre à jour un document existant si l'information y appartient ;
- garder la documentation courte et utile.

---

## 29. État historique récent du projet

Sessions brutes importantes dans `data/projects/chr0nosvers/raw/` :

### 2026-06-07

Stabilisation visuelle du Dashboard, création/validation de `CODE_MAP.md`, correction d'incohérences documentaires, agrandissement du visuel central et identification d'un problème de coupure lié à `overflow`.

### 2026-06-08

Analyse du layout Dashboard, identification du rôle de `.main-content`, `.top-workspace`, `.dashboard-grid`, mise en place d'un canvas fixe initialement en `1920x1080`, préparation de la navigation vers la vue hebdomadaire.

### 2026-06-09

Adoption temporaire du canvas `1620x900`, mieux adapté au split view avec ChatGPT/Codex. Stabilisation des cartes projets et décision d'avancer vers les écrans fonctionnels plutôt que de rester sur le polish visuel.

### 2026-06-10

Passage vers une vraie application Windows installée via Tauri. Validation du stockage local, création de projets, dossiers et sessions Markdown dans AppData. Confirmation que l'app installée fonctionne indépendamment du dépôt.

### 2026-06-11

Premier flux fonctionnel de synthèse hebdomadaire Python. `weekly.py` génère un JSON, Rust lance Python, Tauri expose `generate_weekly_summary`, le Dashboard affiche une proposition. La sortie reste à améliorer pour être plus concise et moins technique.

### 2026-06-12 et 2026-06-15

Fichiers de session présents mais encore vides ou au template.

---

## 30. Écarts et points à surveiller

### Documentation `docs/` vs `🔒docs/`

`INDEX.md` et le dépôt réel utilisent `🔒docs/`.

Certains textes anciens, notamment dans `README.md` et certaines sections de gouvernance, mentionnent encore `docs/`. Ces références sont probablement obsolètes. La source documentaire officielle actuelle est `🔒docs/`.

### Structure courte de l'index

`INDEX.md` donne une structure simplifiée. Le code actuel contient aussi :

- `src/storage/`
- `src/screens/WeeklyView/`
- plusieurs overlays ;
- `🔒docs/system/PROJECT_FILESYSTEM_MAP.md`
- des assets de maquette dans `public/assets/`.

Ce n'est pas nécessairement une erreur, mais NotebookLM doit savoir que l'index est un guide de navigation, pas une liste exhaustive de tous les fichiers.

### Synthèse hebdomadaire encore MVP

Le flux weekly fonctionne, mais la qualité de synthèse est encore simple :

- extraction structurée ;
- regroupement limité ;
- tendance à garder des détails techniques ;
- pas encore une synthèse utilisateur parfaitement concise.

### Validation humaine et archivage

La documentation décrit le cycle complet :

```txt
Génération → Relecture → Modification → Validation humaine → Archivage
```

L'implémentation actuelle couvre surtout :

- génération ;
- affichage ;
- statut de proposition ;
- métadonnées de synthèse partielle.

La validation finale et l'archivage restent des étapes à compléter.

### App installée vs dépôt de développement

Le dépôt contient des données de développement dans `data/`.

L'application installée utilise AppData :

```txt
C:\Users\<Utilisateur>\AppData\Local\chronosvers\data\projects\
```

Il faut éviter de confondre ces deux lieux lors de l'analyse des données réelles.

---

## 31. Fichiers à lire en priorité selon la question

Comprendre le projet :

```txt
INDEX.md
README.md
🔒docs/codex/CODEX_GUIDE.md
🔒docs/rules/governance.md
```

Comprendre l'architecture :

```txt
🔒docs/system/architecture.md
src/App.tsx
src-tauri/src/lib.rs
src/storage/projectStorage.ts
```

Comprendre le stockage :

```txt
🔒docs/system/storage.md
🔒docs/system/PROJECT_FILESYSTEM_MAP.md
src-tauri/src/lib.rs
src/storage/projectStorage.ts
data/projects/
```

Comprendre les synthèses :

```txt
🔒docs/system/synthesis.md
scripts/weekly.py
src-tauri/src/runner.rs
src-tauri/src/lib.rs
src/screens/Dashboard/components/WeeklySummaryOverlay/
```

Comprendre le Dashboard :

```txt
🔒docs/navigation/screens/DASHBOARD_MAP.md
src/screens/Dashboard/Dashboard.tsx
src/screens/Dashboard/Dashboard.css
src/App.tsx
src/App.css
```

Comprendre WeeklyView et les sessions :

```txt
🔒docs/navigation/screens/WEEKLY_VIEW_MAP.md
🔒docs/navigation/screens/SESSION_OVERLAY_MAP.md
src/screens/WeeklyView/WeeklyView.tsx
src/screens/WeeklyView/components/SessionOverlay/
src/screens/WeeklyView/components/TodaySessionCard/
```

Comprendre les composants :

```txt
🔒docs/ui/components.md
🔒docs/navigation/CODE_MAP.md
src/components/ProjectCard/
src/screens/Dashboard/components/
src/screens/WeeklyView/components/
```

Comprendre le visuel :

```txt
🔒docs/ui/layout.md
🔒docs/ui/theme.md
public/assets/
src/App.css
src/screens/Dashboard/Dashboard.css
```

---

## 32. Résumé ultra-court pour NotebookLM

Chr0 / ↻hr0nosV3rs est une application locale React + Tauri de suivi de projets par le temps. Elle transforme des sessions quotidiennes Markdown en mémoire structurée, avec un MVP centré sur Dashboard, projets, WeeklyView, sessions raw et synthèse hebdomadaire. L'architecture officielle est UI → Rust → Python → Filesystem → UI. Le filesystem est la source de vérité. L'humain reste toujours le décideur final : aucune synthèse n'est définitive sans relecture, correction éventuelle et validation humaine. La direction artistique est sombre, néon, cyan/violet, avec un thème clair optionnel "Aube" (bascule en haut-droit du Dashboard, sombre reste le défaut) ; le visuel central sablier/phénix a été remplacé par un raccourci de fin de session (`SessionShortcut`). Le Dashboard utilise un canvas verrouillé `1620x900` pour rester utilisable en split view avec un assistant externe. Le moteur weekly Python existe et fonctionne comme première proposition MVP, mais les synthèses doivent encore être améliorées pour devenir plus concises, moins techniques et mieux orientées utilisateur.

