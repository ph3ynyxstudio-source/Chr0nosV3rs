# WEEKLY VIEW MAP — ↻hr0nosV3rs

## 1. Rôle de l'écran

WeeklyView affiche la semaine active d'un projet.

Il assemble :
- le header de navigation de semaine
- la carte synthèse de gauche
- le board central des jours
- la carte session du jour à droite
- l'overlay de focus session quand il est ouvert

---

## 2. Fichier assembleur principal

`src/screens/WeeklyView/WeeklyView.tsx`

---

## 3. Fichier CSS principal

`src/screens/WeeklyView/WeeklyView.css`

---

## 4. Composants utilisés

- `src/screens/WeeklyView/components/LastSynthesisCard/LastSynthesisCard.tsx`
- `src/screens/WeeklyView/components/WeeklyDayCard/WeeklyDayCard.tsx`
- `src/screens/WeeklyView/components/TodaySessionCard/TodaySessionCard.tsx`
- `src/screens/WeeklyView/components/SessionOverlay/SessionOverlay.tsx`

---

## 5. Blocs CSS importants

- `.weekly-view-shell` → coque complète de l'écran
- `.weekly-view-header` → bandeau haut
- `.weekly-view-brand` → logo + titre
- `.weekly-view-actions` → actions à droite du header
- `.weekly-view-content` → grille principale 3 colonnes
- `.weekly-board` → zone centrale de la semaine
- `.weekly-board-heading` → titre et intro de la semaine
- `.weekly-days-grid` → rangée des cartes jours
- `.weekly-board-note` → aide en bas du board

---

## 6. Quoi modifier pour changer une zone précise

- Changer le header hebdo : `WeeklyView.tsx` + `.weekly-view-header` dans `WeeklyView.css`
- Changer le placement des 3 colonnes : `.weekly-view-content`
- Changer la zone centrale de semaine : `.weekly-board`, `.weekly-days-grid`, `.weekly-board-note`
- Changer une carte jour : `src/screens/WeeklyView/components/WeeklyDayCard/`
- Changer la carte synthèse gauche : `src/screens/WeeklyView/components/LastSynthesisCard/`
- Changer la carte session du jour : `src/screens/WeeklyView/components/TodaySessionCard/`

---

## 7. Ce qu'il ne faut pas toucher

- Ne pas transformer WeeklyView en nouvelle page indépendante
- Ne pas mettre le style des cartes locales dans `src/App.css`
- Ne pas mélanger le layout global avec le style interne des composants locaux

---

## 8. Phrase simple de repérage

```txt
Je veux modifier la vue semaine :
je pars de WeeklyView.tsx pour l'assemblage
et de WeeklyView.css pour la grille globale.
```
