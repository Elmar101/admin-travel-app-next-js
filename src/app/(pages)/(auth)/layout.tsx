"use client";

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="min-h-screen flex items-center justify-center bg-gray-100">{children}</div>;
};

export default AuthLayout;
