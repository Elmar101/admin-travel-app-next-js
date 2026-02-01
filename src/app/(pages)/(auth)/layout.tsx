"use client";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Readonly<AuthLayoutProps>) => {
  return <div className="min-h-screen flex items-center justify-center bg-gray-100">{children}</div>;
};

export default AuthLayout;
