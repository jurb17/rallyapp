// assets
import {
  IconDashboard,
  IconUsers,
  IconBuildingStore,
  IconWriting,
  IconBriefcase,
  IconMessage,
  IconUserPlus,
  IconReceipt2,
} from "@tabler/icons";

// constant
const icons = {
  IconDashboard,
  IconUsers,
  IconBuildingStore,
  IconWriting,
  IconBriefcase,
  IconMessage,
  IconUserPlus,
  IconReceipt2,
};

// ===========================|| DASHBOARD MENU ITEMS ||=========================== //

const advisory = {
  id: "advisory",
  title: "Advisory",
  type: "group",
  children: [
    // {
    //   id: "adv-dashboard",
    //   title: "Dashboard",
    //   type: "item",
    //   url: "/adv/dashboard",
    //   icon: icons.IconDashboard,
    //   breadcrumbs: false,
    // },
    {
      id: "adv-messages",
      title: "Messages",
      type: "item",
      url: "/adv/messages",
      icon: icons.IconMessage,
      breadcrumbs: false,
    },
    {
      id: "adv-clients",
      title: "Clients",
      type: "item",
      url: "/adv/clients",
      icon: icons.IconUsers,
      breadcrumbs: false,
    },
    // {
    //   id: "adv-prospects",
    //   title: "Prospects",
    //   type: "item",
    //   url: "/adv/prospects",
    //   icon: icons.IconUserPlus,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "adv-invoices",
    //   title: "Invoices",
    //   type: "item",
    //   url: "/adv/invoices",
    //   icon: icons.IconReceipt2,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "adv-articles",
    //   title: "Articles",
    //   type: "item",
    //   url: "/adv/articles",
    //   icon: icons.IconWriting,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "adv-services",
    //   title: "Services",
    //   type: "item",
    //   url: "/adv/services",
    //   icon: icons.IconBuildingStore,
    //   breadcrumbs: false,
    // },
  ],
};

export default advisory;
