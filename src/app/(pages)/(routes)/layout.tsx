"use client"
import type { ReactNode } from "react"
import { AppSidebar } from "@/components/sections/app-sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
