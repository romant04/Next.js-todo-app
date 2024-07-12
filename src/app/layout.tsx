import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/src/app/components/layout/navbar";
import { clsx } from "clsx";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreProvider } from "@/src/providers/store-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo app",
  description: "Todo app to manage your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "layout")}>
        <StoreProvider>
          <ThemeProvider defaultTheme="dark" attribute="class" enableSystem>
            <Navbar />
            {children}
            <ToastContainer position={"top-right"} />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
