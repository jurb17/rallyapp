// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

// In the route handler for /create-verification-session:
// Authenticate your user.

// Create the session.
const verificationSession = await stripe.identity.verificationSessions.create({
  type: "document",
  metadata: {
    user_id: "{{USER_ID}}",
  },
});

// Return only the session URL to the frontend.
const url = verificationSession.url;
