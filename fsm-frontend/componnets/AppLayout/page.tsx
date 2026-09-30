"use client";

import React from "react";
import { usePathname } from "next/navigation";
import LayoutStructure from "@/layoutStructure/page";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noLayoutRoutes = [
    "/user-login",
    "/"
  ];

  const shouldHideLayout = noLayoutRoutes.includes(pathname);

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return <LayoutStructure>{children}</LayoutStructure>;
}