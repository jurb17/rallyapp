import React, { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import Survey from "views/pages/survey/index";
import ClientManagement from "views/advisor-clients/index";
import ServiceManagement from "views/advisor-services/index";
import ArticleManagement from "views/advisor-articles/index";

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import("views/utilities/Typography"))
);
const UtilsColor = Loadable(lazy(() => import("views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
  lazy(() => import("views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import("views/utilities/TablerIcons"))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import("views/sample-page")));

// ===========================|| MAIN ROUTING ||=========================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/clients",
      element: <ClientManagement />,
    },
    {
      path: "/services",
      element: <ServiceManagement />,
    },
    {
      path: "/articles",
      element: <ArticleManagement />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/old-dashboard",
      element: <OldDashboard />,
    },
    {
      path: "/survey",
      element: <Survey />,
    },
    {
      path: "/utils/util-typography",
      element: <UtilsTypography />,
    },
    {
      path: "/utils/util-color",
      element: <UtilsColor />,
    },
    {
      path: "/utils/util-shadow",
      element: <UtilsShadow />,
    },
    {
      path: "/icons/tabler-icons",
      element: <UtilsTablerIcons />,
    },
    {
      path: "/icons/material-icons",
      element: <UtilsMaterialIcons />,
    },
    {
      path: "/sample-page",
      element: <SamplePage />,
    },
  ],
};

export default MainRoutes;
