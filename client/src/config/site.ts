export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MASKoff",
  description: "A full-stack job platform with community engagement, direct messaging, and interview scheduling.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: 'Posts',
      href: '/posts',
    },
    {
      label: 'Jobs',
      href: '/jobs',
    },
    {
      label: "Messages",
      href: "/messages",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Create User",
      href: "/newuser",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
