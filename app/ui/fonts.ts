import { Tinos, Racing_Sans_One, Source_Code_Pro } from "next/font/google";


export const tinos = Tinos({
    subsets: ["latin"],
    weight: ["400", "700"], // regular, bold
    style: ["normal", "italic"],    // optional
    variable: "--posh",
})

export const racing_sans_one = Racing_Sans_One({
    subsets: ["latin"],
    variable: "--impact",
    weight: "400",
})

export const sourceCodePro = Source_Code_Pro({
    subsets: ["latin"],
    variable: "--code",
    weight: ["300","400","800"],
})