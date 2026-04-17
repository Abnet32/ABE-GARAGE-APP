import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import { fa } from "zod/locales";
import icon from "public/repair-shop.png";

export const metadata: Metadata = {
  title: "አቤ ጋራዥ ",
  description: "Abe Garage is a car maintenance and repair service provider based in Ethiopia. We offer a wide range of services including oil changes, brake repairs, engine diagnostics, and more. Our team of experienced mechanics is dedicated to providing high-quality service to our customers.",
  icons: {
    icon: icon.src,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
