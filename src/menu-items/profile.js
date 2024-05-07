// assets
import {
  IconUser,
  IconSettings,
  IconBriefcase,
  IconDisabled,
} from "@tabler/icons";

// IconCertificate, IconFileCertificate, IconHandRock, IconBusinessPlan, IconCash, IconCoin,
// IconCreditCard, IconCurrencyBitcoin, IconCurrencyDollar, IconWallet, IconZoomMoney, IconReportMoney,
// IconBuildingBank,

// constant
const icons = {
  IconUser,
  IconSettings,
  IconBriefcase,
  IconDisabled,
};

// ===========================|| DASHBOARD MENU ITEMS ||=========================== //

const profile = {
  id: "profile",
  title: "Profile",
  type: "group",
  children: [
    {
      id: "profile/advisor",
      title: "Advisor",
      type: "item",
      url: "/adv/profile/advisor",
      icon: icons.IconUser,
      breadcrumbs: false,
    },
    {
      id: "profile/firm",
      title: "Firm",
      type: "item",
      url: "/adv/profile/firm",
      icon: icons.IconBriefcase,
      breadcrumbs: false,
    },
  ],
};

export default profile;
