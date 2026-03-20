export interface LogoFont {
  family: string;
  weight: number;
  category: "sans" | "serif" | "display" | "mono";
}

export const LOGO_FONTS: LogoFont[] = [
  { family: "Inter", weight: 700, category: "sans" },
  { family: "Poppins", weight: 700, category: "sans" },
  { family: "Montserrat", weight: 800, category: "sans" },
  { family: "Raleway", weight: 700, category: "sans" },
  { family: "Space Grotesk", weight: 700, category: "sans" },
  { family: "DM Sans", weight: 700, category: "sans" },
  { family: "Outfit", weight: 700, category: "sans" },
  { family: "Sora", weight: 700, category: "sans" },
  { family: "Plus Jakarta Sans", weight: 700, category: "sans" },
  { family: "Manrope", weight: 700, category: "sans" },
  { family: "Playfair Display", weight: 700, category: "serif" },
  { family: "Lora", weight: 700, category: "serif" },
  { family: "Merriweather", weight: 700, category: "serif" },
  { family: "Fraunces", weight: 700, category: "serif" },
  { family: "Crimson Pro", weight: 700, category: "serif" },
  { family: "Pacifico", weight: 400, category: "display" },
  { family: "Righteous", weight: 400, category: "display" },
  { family: "Bebas Neue", weight: 400, category: "display" },
  { family: "Fredoka", weight: 600, category: "display" },
  { family: "Comfortaa", weight: 700, category: "display" },
  { family: "Archivo Black", weight: 400, category: "display" },
  { family: "Unbounded", weight: 700, category: "display" },
  { family: "JetBrains Mono", weight: 700, category: "mono" },
  { family: "Fira Code", weight: 700, category: "mono" },
  { family: "Space Mono", weight: 700, category: "mono" },
];

export function getFontGoogleUrl(family: string, weight: number): string {
  const encoded = family.replace(/ /g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weight}&display=swap`;
}

export function getFontByFamily(family: string): LogoFont | undefined {
  return LOGO_FONTS.find((f) => f.family === family);
}
