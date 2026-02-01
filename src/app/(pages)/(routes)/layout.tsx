"use client"
import { AppSidebar } from "@/components/sections/app-sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
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
