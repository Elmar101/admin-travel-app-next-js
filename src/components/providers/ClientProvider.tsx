import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

const ClientProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
};

export default ClientProvider;
