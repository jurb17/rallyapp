// assets
import {
  IconMail,
  IconReceipt2,
  IconReport,
  IconUserCheck,
  IconMessage,
  IconUserPlus,
} from "@tabler/icons";

// IconCertificate, IconFileCertificate, IconHandRock, IconBusinessPlan, IconCash, IconCoin,
// IconCreditCard, IconCurrencyBitcoin, IconCurrencyDollar, IconWallet, IconZoomMoney, IconReportMoney,
// IconBuildingBank, IconReport, IconBriefcase, IconUserCheck

// constant
const icons = {
  IconMail,
  IconReceipt2,
  IconReport,
  IconUserCheck,
  IconMessage,
  IconUserPlus,
};

// ===========================|| DASHBOARD MENU ITEMS ||=========================== //

const client = {
  id: "client",
  title: "Client Portal",
  type: "group",
  children: [
    {
      id: "client-messages",
      title: "Messages",
      type: "item",
      url: "/client/messages",
      icon: icons.IconMessage,
      breadcrumbs: false,
    },
    // {
    //   id: "client-advisors",
    //   title: "Advice",
    //   type: "item",
    //   url: "/client/advisors",
    //   icon: icons.IconUserCheck,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "client-payments",
    //   title: "Pay",
    //   type: "item",
    //   url: "/client/payments",
    //   icon: icons.IconReceipt2,
    //   breadcrumbs: false,
    // },
  ],
};

export default client;
