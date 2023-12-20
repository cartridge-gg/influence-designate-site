import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Designate Account | Cartridge x Influence",
  description: "Cartridge x Influence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          background: "var(--chakra-colors-solid-bg)",
          height: "100vh",
        }}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
