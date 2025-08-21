import Sidebar from "@/components/layout/Sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";

// export default function DashboardLayout() {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-red-100 overflow-y-auto">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import React from "react";

export default function DashboardLayout() {
  const breadcrumbs = useBreadcrumbs();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {!isDashboard && (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to="/dashboard">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.length > 0 && <BreadcrumbSeparator />}

                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.to}>
                      <BreadcrumbItem>
                        {index < breadcrumbs.length - 1 ? (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.to}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
          <Outlet />
        </div>
      </SidebarInset>
      {/* <Outlet/> */}
    </SidebarProvider>
  );
}
