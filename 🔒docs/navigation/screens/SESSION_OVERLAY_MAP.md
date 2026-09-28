# SESSION OVERLAY MAP — ↻hr0nosV3rs

## 1. Rôle de la zone

SessionOverlay affiche une ou deux sessions ouvertes au-dessus de WeeklyView.

Il garde :
- WeeklyView visible derrière
- un fond blur + assombri
- une rangée de mini-cartes jours
- des cartes de focus session au centre

---

## 2. Fichier assembleur principal

`src/screens/WeeklyView/components/SessionOverlay/SessionOverlay.tsx`

---

## 3. Fichier CSS principal

`src/screens/WeeklyView/components/SessionOverlay/SessionOverlay.css`

---

## 4. Composants utilisés

Pas de sous-composant dédié actuellement.

L'overlay est monté depuis :
- `src/screens/WeeklyView/WeeklyView.tsx`

Données mockées utilisées :
- `src/screens/WeeklyView/mockSessions.ts`

---

## 5. Blocs CSS importants

- `.session-overlay` → couche globale de l'overlay
- `.session-overlay-backdrop` → blur + assombrissement
- `.session-overlay-close-all` → bouton fermer tout
- `.session-overlay-mini-days` → rangée haute des mini-cartes jours
- `.session-overlay-mini-day` → mini-carte jour
- `.session-overlay-panel` → zone centrale des cartes ouvertes
- `.session-focus-card` → carte session ouverte
- `.session-focus-card-header` → haut de la carte
- `.session-focus-card-scroll` → contenu scrollable
- `.session-overlay-note` → texte d'aide en bas

---

## 6. Quoi modifier pour changer une zone précise

- Changer la position de la rangée haute : `.session-overlay-mini-days`
- Changer la taille des mini-cartes jours : `.session-overlay-mini-day`
- Changer la position des grandes cartes ouvertes : `.session-overlay-panel`
- Changer la taille d'une carte session : `.session-focus-card`
- Changer le haut d'une carte session : `.session-focus-card-header`
- Changer le contenu interne des cartes : `.session-focus-card-scroll` et `.session-focus-card-section`
- Changer les textes mockés : `src/screens/WeeklyView/mockSessions.ts`

---

## 7. Ce qu'il ne faut pas toucher

- Ne pas créer une nouvelle page pour les sessions
- Ne pas brancher Rust, Python ou stockage ici
- Ne pas déplacer la logique d'ouverture hors de `WeeklyView.tsx`

---

## 8. Phrase simple de repérage

```txt
Je veux modifier l'overlay session :
je pars de SessionOverlay.tsx pour la structure
et de SessionOverlay.css pour toutes les zones visibles de l'overlay.
```
