import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  GalleryVerticalEnd,
  ListOrdered,
  PieChart,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Anuj Kumar",
    email: "anuj.kumar@atomicloops.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Atomic Loops",
      logo: GalleryVerticalEnd,
      plan: "Pvt. Ltd.",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Users",
      url: "/users",
      icon: Bot,
      items: [
        { title: "All Users", url: "/users" },
        // { title: "Active Users", url: "/users/active" },
        // { title: "Inactive Users", url: "/users/inactive" },
      ],
    },
    // {
    //   title: "Reports",
    //   url: "/reports",
    //   icon: PieChart,
    //   items: [
    //     { title: "Daily", url: "/reports/daily" },
    //     { title: "Monthly", url: "/reports/monthly" },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings2,
    //   items: [{ title: "General", url: "/settings/general" }],
    // },
  ],

  products: [
    {
      title: "Products",
      url: "/products",
      icon: Bot,
      items: [
        { title: "All Products", url: "/products" },
        // { title: "All Orders", url: "/orders" },
      ],
    },
  ],

  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },
    {
      name: "Orders",
      url: "/orders",
      icon: ListOrdered,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain heading="User management" items={data.navMain} />
        <NavMain heading="Products" items={data.products} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
