import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardShell } from "@/components/dashboard-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Overview | Next-Crypto",
    template: "%s | Next-Crypto",
  },
  description: "Non-custodial cryptocurrency market insights and portfolio tracking — in development.",
  applicationName: "Next-Crypto",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <DashboardShell>{children}</DashboardShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
