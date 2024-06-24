export const pageGuideObject = {
  "/login": {
    title: "The Login Page",
    description: [
      "Welcome to the Rally App Demo!",
      "This React application was designed and developed by Jordan Urbaczek for the purpose of connecting independent financial advisors to everyday Americans seeking financial guidance. The application has a variety of features that facilitate the relationship between a financial advisor and their clients. ",
      'At any time, please select the "About This Page" button in the top-right corner of the page to learn more about the features on the current page.',
      "Thank you!",
    ],
  },
  // ADVISOR PAGES
  "/adv": { title: "", description: "" },
  "/adv/messages": {
    title: "The Messages Page",
    description: [
      "The messages feature was created to provide a space for conversations between advisors and their clients.",
      "Previously, message data was pulled from a database every 10-15 seconds on a continuous loop in the background. If the database happened to have new messages for the user, a notification would appear for that user and direct them towards the messages page. flogoutThis feature provided the experience of instant messaging on the Rally app.",
      "There is no database linked to this demo version, so the app is not looking for new messages. But you can still select a chat from the Chat List and send messages to your imaginary clients!",
    ],
  },
  "/adv/messages/": {
    title: "The Messages Page",
    description: [
      "The messages feature was created to provide a space for conversations between advisors and their clients.",
      "Previously, message data was pulled from a database every 10-15 seconds on a continuous loop in the background. If the database happened to have new messages for the user, a notification would appear for that user and direct them towards the messages page. This feature provided the experience of instant messaging on the Rally app.",
      "There is no database linked to this demo version, so the app is not looking for new messages. But you can still select a chat from the Chat List to send messages to your imaginary clients!",
    ],
  },
  "/adv/clients": {
    title: "The Clients Page",
    description: [
      "The clients page provides an overview of the clients that the advisor is currently advising.",
      "Clients are paying customers of the advisor, while prospects are users that have directly reached out to the advisor with interest in their services, but have not yet paid the advisor for service.",
      "Select a client to see more details about them.",
    ],
  },
  "/adv/clients/profile": {
    title: "The Client Profile Page",
    description: [
      "The client profile page showcases more details about the client user.",
      'There is an area below the basic profile details called "Custom Fields" which allows the advisor to add custom details about the client. Click the "+ Add New" button to add more information.',
      "There are also quick links at the top right of the page to manage invoices and communications with this client.",
    ],
  },
  "/adv/prospects": {
    title: "The Prospects Page",
    description: [
      "The prospects page provides an overview of the prospects that are inquiring about the advisor's services.",
      "Anyone seeking financial advice on www.rally.markets can browse options for financial advisors and message them directly through the Rally app for more information. Once the prospect sends a message, the advisor will receive a notification and can respond. Prospects become clients once they have paid for a service from the advisor.",
    ],
  },
  "/adv/prospects/profile": {
    title: "The Prospect Profile Page",
    description: [
      "The prospect profile page provides an overview of the prospect.",
      "Details are limited and custom fields cannot be added until the prospect becomes a client. There are quick links at the top right of the page to manage invoices and communications with this prospect.",
    ],
  },
  "/adv/articles": {
    title: "The Articles List Page",
    description: [
      "The articles feature is provided to advisors so they can share wisdom on the publicly shared Rally Blog and advertise themselves.",
      "The concept of a shared advisors blog was formed around the importance of social media and online consuption of advice. The shared blog would allow clients to find the advisors speaking about a topic they're interested in knowing more about.",
    ],
  },
  "/adv/articles/profile": {
    title: "The Article Overview Page",
    description: [
      "This page provides an overview of the article's details, including the category and subcategory, description, and title. The article details can be edited at any time. Updates to the article are typically saved and are public almost instantly. However, articles on this demo version are not public and new articles will not be saved.",
      "The category and subcategory are used to filter articles on the public blog. The article title and description are presented on each display card in the public list of articles.",
    ],
  },
  "/adv/articles/new": {
    title: "The New Article Page",
    description: [
      "This page provides advisors with an opportunity to write about their practice and advertise themselves. The title and body of the article function like a blog post. The Rally application is meant to process the article into a new public-facing blog post on the rally.markets website for the world to see.",
      "In the next page, the advisor will be asked to provide more details about the article before publishing.",
    ],
  },
  "/adv/articles/preview": {
    title: "The Article Preview Page",
    description: [
      "This page is meant to gather the final details about the article before publishing. The category and subcategory are selected by the advisor so their article can be discovered by folks looking for insight about a specific topic. The public blog posts can be filtered by category and subcategory.",
      "On the public blog, articles are listed on cards. The description text here will be presented on the article card to give the user an idea about the content of the article before selecting it.",
    ],
  },
  // CLIENT PAGES
  "/client/messages": {
    title: "The Messages Page",
    description: [
      "The messages feature was created to provide a space for conversations between clients and their advisors.",
      "Previously, message data was pulled from a database every 10-15 seconds on a continuous loop in the background. If the database happened to have new messages for the user, a notification would appear for that user and direct them towards the messages page. This feature provided the experience of instant messaging on the Rally app.",
      "There is no database linked to this demo version, so the app is not looking for new messages. But you can still select a chat from the Chat List to send messages to your imaginary advisors!",
    ],
  },
  "/client/messages/": {
    title: "The Messages Page",
    description: [
      "The messages feature was created to provide a space for conversations between clients and their advisors.",
      "Previously, message data was pulled from a database every 10-15 seconds on a continuous loop in the background. If the database happened to have new messages for the user, a notification would appear for that user and direct them towards the messages page. This feature provided the experience of instant messaging on the Rally app.",
      "There is no database linked to this demo version, so the app is not looking for new messages. But you can still select a chat from the Chat List to send messages to your imaginary advisors!",
    ],
  },
};
