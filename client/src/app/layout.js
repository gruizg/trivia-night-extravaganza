import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/navbar/Navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Headline face for the marketing pages (home/about/rules/contact) - a
// square, geeky grotesk that fits a trivia-night-for-nerds brand without
// tipping into a novelty/comic-sans-adjacent look.
const spaceGrotesk = Space_Grotesk({
    variable: "--font-display",
    subsets: ["latin"],
    weight: ["500", "700"],
});

export const metadata = {
    title: "Trivia Night Extravaganza",
    description: "Six rounds. Three questions each. One team walks away wearing the crown.",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
        >
        <body className="flex h-screen flex-col overflow-y-auto">
        <Navbar />
        <main className={"mt-28 mx-5 mb-5 flex-1 flex flex-col min-h-0"}>{children}</main>
        </body>
        </html>
    );
}