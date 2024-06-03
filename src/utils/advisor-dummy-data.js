export const advisorChatList = [
  {
    adviceid: 1,
    token: 1,
    name: "Donald Duck",
    body: "Hey there",
    messages: [
      {
        id: 1,
        advisor: 1,
        body: "Hey there, client. Nice to meet you on Rally.",
        sentby: 0,
        timestamp: "1717457104",
      },
      {
        id: 2,
        advisor: 1,
        body: "Hi! Great to meet you as well.",
        sentby: 0,
        timestamp: "1717457116",
      },
    ],
  },
  {
    adviceid: 2,
    token: 2,
    name: "Goofy Dog",
    messages: [{ id: 1, text: "Hey there", sentby: 0 }],
  },
  {
    adviceid: 3,
    token: 3,
    name: "Mickey Mouse",
    messages: [{ id: 1, text: "Hey there", sentby: 0 }],
  },
  {
    adviceid: 4,
    token: 4,
    name: "Minney Mouse",
    messages: [{ id: 1, text: "Hey there", sentby: 0 }],
  },
];

export const advisorClientList = [
  { id: 1, name: "Donald Duck" },
  { id: 2, name: "Goofy Dog" },
  { id: 3, name: "Mickey Mouse" },
  { id: 4, name: "Minney Mouse" },
];
