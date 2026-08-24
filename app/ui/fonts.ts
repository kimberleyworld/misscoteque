import { Racing_Sans_One, Source_Code_Pro, Tinos } from "next/font/google";

export const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--code",
});

export const racing_sans_one = Racing_Sans_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--impact",
});

export const tinos = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--posh",
});
