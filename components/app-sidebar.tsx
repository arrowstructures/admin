"use client";

import * as React from "react";
import { NewspaperIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Newsletter",
      url: "#",
      icon: NewspaperIcon,
      isActive: true,
      items: [
        {
          title: "List",
          url: "/admin/newsletter/list",
        },
        {
          title: "Create",
          url: "/admin/newsletter/create",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User>();
  const { open } = useSidebar();

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return; // redirect if not authenticated
      }

      setUser(user);
      console.log(user);
    };

    getUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            height="32"
            width="32"
            alt="Arrow Structures Logo"
          />
          <span
            className={cn(
              "hidden font-bold sm:inline-block",
              !open && "sm:hidden"
            )}
          >
            ARROW STRUCTURES
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
