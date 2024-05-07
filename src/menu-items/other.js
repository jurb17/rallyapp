// assets
import { IconBrandChrome, IconHelp, IconSitemap } from "@tabler/icons";

// constant
const icons = {
  IconBrandChrome,
  IconHelp,
  IconSitemap,
};

// ===========================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||=========================== //

const other = {
  id: "sample-docs-roadmap",
  type: "group",
  children: [
    {
      id: "sample-page",
      title: "Sample Page",
      type: "item",
      url: "/sample-page",
      icon: icons.IconBrandChrome,
      breadcrumbs: false,
    },
    // {
    //   id: "documentation",
    //   title: "Documentation",
    //   type: "item",
    //   url: "https://codedthemes.gitbook.io/berry/",
    //   icon: icons.IconHelp,
    //   external: true,
    //   target: true,
    // },
    // {
    //     id: 'old-dashboard',
    //     title: 'Old Dashboard',
    //     type: 'item',
    //     url: '/adv/old-dashboard',
    //     icon: icons.IconHelp,
    //     breadcrumbs: false
    // },
    // {
    //     id: 'survey',
    //     title: 'Survey',
    //     type: 'item',
    //     url: '/adv/survey',
    //     icon: icons.IconHelp,
    //     breadcrumbs: false
    // }
  ],
};

export default other;
