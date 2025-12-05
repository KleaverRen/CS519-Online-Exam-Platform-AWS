// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import ThemeProvider from "../components/ThemeProvider";
import AppHeader from "../components/AppHeader";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <main className="min-h-screen flex flex-col">
            <AppHeader />
            <div className="flex-1">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
