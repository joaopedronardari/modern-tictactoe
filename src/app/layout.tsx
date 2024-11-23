import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/GameContext";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Jogo da Velha",
  description: "Um jogo da velha moderno com IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-gray-950 text-white min-h-screen`}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
