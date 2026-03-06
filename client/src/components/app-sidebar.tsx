import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileCheck, 
  Users, 
  FolderOpen, 
  BarChart3, 
  BookOpen,
  TrendingUp,
  MapPin,
  FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Bloques",
    url: "/bloques",
    icon: FileCheck,
  },
  {
    title: "Contratos",
    url: "/contratos",
    icon: FileText,
  },
  {
    title: "Stakeholders",
    url: "/stakeholders",
    icon: Users,
  },
  {
    title: "Evidencias",
    url: "/evidencias",
    icon: FolderOpen,
  },
  {
    title: "KPIs & Automatización",
    url: "/kpis",
    icon: BarChart3,
  },
  {
    title: "Procedimientos",
    url: "/procedimientos",
    icon: BookOpen,
  },
  {
    title: "Accionistas",
    url: "/accionistas",
    icon: TrendingUp,
  },
  {
    title: "Social/Demográfico",
    url: "/demografico",
    icon: MapPin,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Gestión Minera</h2>
            <p className="text-xs text-muted-foreground">Roadmap Integral</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">v1.0</Badge>
          <span>Sistema de Gestión</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
