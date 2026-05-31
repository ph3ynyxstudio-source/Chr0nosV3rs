export const DESIGN_TOKENS = {
  colors: {
    bg: {
      app: "#02050a", // Fond ultra sombre
      card: "rgba(10, 18, 30, 0.45)", // Cartes vitrées sombres
      cardEdit: "rgba(20, 35, 60, 0.6)", // Accent pour les 2 jours éditables
    },
    text: {
      primary: "#ffffff",
      secondary: "#94a3b8", // Gris textuel secondaire
      muted: "#475569", // Jours en lecture seule
    },
    accent: {
      blue: "#38bdf8", // Cyan des jauges
      purple: "#a855f7", // Violet de sélection
    },
  },
} as const;
