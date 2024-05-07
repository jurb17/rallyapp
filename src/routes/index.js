import React, { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loadable from "ui-component/Loadable";

// project imports
import MainLayout from "layout/MainLayout";
import MinimalLayout from "layout/MinimalLayout";
import { element } from "prop-types";
import AdvisorLayout from "layout/AdvisorLayout";
import ClientLayout from "layout/ClientLayout";

// login, signup, register, and universal routing
const AuthLogin3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Login3"))
);
const AuthRegister3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Register3"))
);
const Signup = Loadable(lazy(() => import("views/pages/signup")));
const SignupSuccessPage = Loadable(
  lazy(() => import("views/pages/signup/SignupSuccess"))
);
const Survey = Loadable(lazy(() => import("views/pages/survey")));
const Settings = Loadable(lazy(() => import("views/pages/settings")));
const ProspectLanding = Loadable(
  lazy(() => import("views/pages/other/ProspectLanding"))
);

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

// advisor menu routing
const Dashboard = Loadable(lazy(() => import("views/advisor-dashboard")));
const ServiceManagement = Loadable(
  lazy(() => import("views/advisor-services"))
);
const ArticleManagement = Loadable(
  lazy(() => import("views/advisor-articles"))
);
const ProspectManagement = Loadable(
  lazy(() => import("views/advisor-prospects"))
);
const ClientManagement = Loadable(lazy(() => import("views/advisor-clients")));
const InvoiceManagement = Loadable(
  lazy(() => import("views/advisor-invoices"))
);
const AdvisorMessageManagement = Loadable(
  lazy(() => import("views/advisor-messages/index"))
);

// advisor page routing
const ProspectProfilePage = Loadable(
  lazy(() => import("views/advisor-prospects/ProspectProfile"))
);
const NewClientInvitePage = Loadable(
  lazy(() => import("views/advisor-clients/NewClientInvite"))
);
const ClientProfilePage = Loadable(
  lazy(() => import("views/advisor-clients/ClientProfile"))
);
const NewServicePage = Loadable(
  lazy(() => import("views/advisor-services/NewService"))
);
const ServiceProfilePage = Loadable(
  lazy(() => import("views/advisor-services/ServiceProfile"))
);
const ArticleProfilePage = Loadable(
  lazy(() => import("views/advisor-articles/ArticleProfile"))
);
const NewArticlePage = Loadable(
  lazy(() => import("views/advisor-articles/NewArticle"))
);
const PreviewArticlePage = Loadable(
  lazy(() => import("views/advisor-articles/PreviewArticle"))
);
const NewInvoicePage = Loadable(
  lazy(() => import("views/advisor-invoices/NewInvoice"))
);
const PreviewInvoicePage = Loadable(
  lazy(() => import("views/advisor-invoices/PreviewInvoice"))
);
const InvoiceProfilePage = Loadable(
  lazy(() => import("views/advisor-invoices/InvoiceProfile"))
);
const AdvisorProfile = Loadable(lazy(() => import("views/advisor-profile")));
const FirmProfilePage = Loadable(lazy(() => import("views/advisor-profile")));

// client menu routing
const ClientPaymentManagement = Loadable(
  lazy(() => import("views/client-payments"))
);
const ClientAdvisorManagement = Loadable(
  lazy(() => import("views/client-advisors"))
);
const ClientMessageManagement = Loadable(
  lazy(() => import("views/client-messages"))
);

// client page routing
const ClientAdvisorProfilePage = Loadable(
  lazy(() => import("views/client-advisors/ClientAdvisorProfile"))
);
const ClientPaymentProfilePage = Loadable(
  lazy(() => import("views/client-payments/PaymentProfile"))
);
const ClientNewFirmRequestPage = Loadable(
  lazy(() => import("views/client-advisors/NewFirmRequest"))
);

const routes = (path) => [
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/login" />,
      },
      // login routes
      {
        path: "/login",
        element: <AuthLogin3 />,
      },
      // signup routes
      {
        path: "/signup",
        element: <MinimalLayout />,
        children: [
          {
            index: true,
            path: "/signup",
            element: <Signup />,
          },
          {
            path: "/signup/success",
            element: <SignupSuccessPage />,
          },
        ],
      },
      // register routes
      {
        path: "/register",
        element: <MinimalLayout />,
        children: [
          {
            index: true,
            path: "/register",
            element: <AuthRegister3 />,
          },
          {
            path: "/register/advisor",
            element: <AuthRegister3 />,
          },
        ],
      },
      // onboarding routes
      {
        path: "/onboarding",
        element: <Survey />,
      },
      // landing routes
      {
        path: "/prospect/new",
        element: <ProspectLanding />,
      },
      // advisor routes
      {
        path: "/adv",
        element: <AdvisorLayout />,
        children: [
          {
            path: "/adv",
            element: <Navigate to="/adv/messages" />,
          },
          // advisor dashboard
          { path: "/adv/dashboard", element: <Dashboard /> },
          // advisor clients
          {
            path: "/adv/clients",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/adv/clients",
                element: <ClientManagement />,
              },
              {
                path: "/adv/clients/new",
                element: <NewClientInvitePage />,
              },
              {
                path: "/adv/clients/:id",
                element: <ClientProfilePage />,
              },
            ],
          },
          // advisor prospects
          {
            path: "/adv/prospects",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/adv/prospects",
                element: <ProspectManagement />,
              },
              {
                path: "/adv/prospects/:id",
                element: <ProspectProfilePage />,
              },
            ],
          },
          // advisor services
          {
            path: "/adv/services",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/adv/services",
                element: <ServiceManagement />,
              },
              {
                path: "/adv/services/new",
                element: <NewServicePage />,
              },
              {
                path: "/adv/services/:id",
                element: <ServiceProfilePage />,
              },
            ],
          },
          // advisor articles
          {
            path: "/adv/articles",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/adv/articles",
                element: <ArticleManagement />,
              },
              {
                path: "/adv/articles/new",
                element: <NewArticlePage />,
              },
              {
                path: "/adv/articles/preview",
                element: <PreviewArticlePage />,
              },
              {
                path: "/adv/articles/:id",
                element: <ArticleProfilePage />,
              },
            ],
          },
          // advisor invoices
          {
            path: "/adv/invoices",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/adv/invoices",
                element: <InvoiceManagement />,
              },
              {
                path: "/adv/invoices/new",
                element: <NewInvoicePage />,
              },
              {
                path: "/adv/invoices/preview",
                element: <PreviewInvoicePage />,
              },
              {
                path: "/adv/invoices/:adviceid/:id",
                element: <InvoiceProfilePage />,
              },
            ],
          },
          // advisor messages
          {
            path: "/adv/messages",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/adv/messages",
                element: <AdvisorMessageManagement />,
              },
            ],
          },
          // advisor profiles
          {
            path: "/adv/profile/advisor",
            element: <AdvisorProfile />,
          },
          { path: "/adv/profile/firm", element: <FirmProfilePage /> },
          // advisor settings routes
          {
            path: "/adv/settings",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/adv/settings",
                element: <Settings />,
              },
              {
                path: "/adv/settings/check-merchant",
                element: <Settings />,
              },
              {
                path: "/adv/settings/check-verification",
                element: <Settings />,
              },
            ],
          },
          { path: "*", element: <Navigate to="/adv/clients" /> },
        ],
      },
      // client routes
      {
        path: "/client",
        element: <ClientLayout />,
        children: [
          {
            path: "/client",
            element: <Navigate to="/client/messages" />,
          },
          // client advisors
          {
            path: "/client/advisors",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/client/advisors",
                element: <ClientAdvisorManagement />,
              },
              {
                path: "/client/advisors/new", // new-firm-request
                element: <ClientNewFirmRequestPage />,
              },
              {
                path: "/client/advisors/:id",
                element: <ClientAdvisorProfilePage />,
              },
            ],
          },
          //client messages
          {
            path: "/client/messages",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/client/messages",
                element: <ClientMessageManagement />,
              },
            ],
          },
          // client payments
          {
            path: "/client/payments",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/client/payments",
                element: <ClientPaymentManagement />,
              },
              {
                path: "/client/payments/:adviceid/:id",
                element: <ClientPaymentProfilePage />,
              },
            ],
          },
          // client settings
          {
            path: "/client/settings",
            element: <MinimalLayout />,
            children: [
              {
                index: true,
                path: "/client/settings",
                element: <Settings />,
              },
              {
                path: "/client/settings/check-customer",
                element: <Settings />,
              },
            ],
          },
          { path: "*", element: <Navigate to="/client/messages" /> },
        ],
      },
      { path: "*", element: <Navigate to="/login" /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
];

export default routes;

// {
//   path: "/utilities",
//   element: <MinimalLayout />,
//   children: [
//     { path: "/", element: <UtilsTypography /> },
//     { path: "/color", element: <UtilsColor /> },
//     { path: "/shadow", element: <UtilsShadow /> },
//     { path: "/material-icons", element: <UtilsMaterialIcons /> },
//     { path: "/tabler-icons", element: <UtilsTablerIcons /> },
//   ],
// },
