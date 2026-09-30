import React from "react";
import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import "./layout.css";
import AppLayout from "@/componnets/AppLayout/page";

export const metadata: Metadata = {
  title: "FSM Cloud",
  description: "FSM Cloud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}