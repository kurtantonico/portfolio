/* =====================================================================
   buddy-data.js — everything Lumi (the star) says and knows.
   Edit this file; you don't need to touch buddy.js.

   How answers work (no AI service, nothing leaves the page):
   Lumi only answers from what is written here + what is already in data.js
   (your bio, projects, stack, email, socials, communities). It never makes
   things up. If nothing matches, it says the "fallback" line below.
   ===================================================================== */
const BUDDY = {
  enabled: true, // set to false to remove Lumi completely
  name: "Lumi",

  // First thing it says (once per browser session, a few seconds after load)
  greeting: "Hi! I'm Lumi, welcome to Kurt's site! 👋",

  // First message inside the chat
  welcome:
    "Hi, I'm Lumi ✨ I know Kurt's projects, stack and how to reach him. What would you like to know?",

  // Quick-tap questions under the chat
  suggestions: [
    "What does Kurt build?",
    "What's in his stack?",
    "Is he open to work?",
    "How can I reach him?",
  ],

  // What Lumi says (once each) when you scroll into a section. Delete a line to keep it quiet.
  sections: {
    home: "Back at the top! Plenty more below ✨",
    projects: "This is what Kurt's been building. Tap a card to peek inside!",
    stack: "The tools in Kurt's toolbox 🧰",
    certs: "The paper trail 📜",
    writing: "Kurt writes too. New posts go up on Substack.",
    contact: "Want to work together? Drop Kurt an email 💌",
  },

  /* ---------------------------------------------------------------
     KNOWLEDGE — "feed it information" here. One entry per topic:

       keywords  words/phrases in a visitor's question that should trigger it
                 (lowercase; "open to" with a space is treated as a phrase)
       answer    what Lumi replies (plain text)
       actions   optional buttons under the reply:
                   { label: "Email Kurt", href: "mailto:you@mail.com" }
                   { label: "See projects", go: "projects" }   ← scrolls to a section
                   { label: "Open Agapay", project: 3 }         ← opens that project page

     Entries here win over Lumi's automatic ones (projects, stack, contact...).
     Copy the template at the bottom to add more.
     --------------------------------------------------------------- */
  knowledge: [
    {
      topic: "availability",
      keywords: ["open", "available", "hire", "hiring", "freelance", "job", "internship", "opportunity", "opportunities", "employment"],
      answer: "Kurt is open to opportunities. The best way to reach him is by email.",
      actions: [{ label: "Email Kurt", href: "mailto:kurtantonico@gmail.com" }],
    },
    {
      topic: "location",
      keywords: ["where", "location", "based", "live", "city", "country", "manila", "philippines", "timezone"],
      answer: "Kurt is based in Manila, Philippines.",
    },
    {
      topic: "focus",
      keywords: ["focus", "interested", "ai", "ml", "agri", "agricultural", "machine learning", "learning", "goal", "goals", "future"],
      answer:
        "Kurt is a full stack engineer growing deeper into AI/ML, with a goal of applied agricultural AI.",
    },

    // ---- TEMPLATE: copy, paste, edit ----
    // {
    //   topic: "resume",
    //   keywords: ["resume", "cv", "experience", "background"],
    //   answer: "Write what Lumi should say here.",
    //   actions: [{ label: "Open resume", href: "resume.pdf" }],
    // },
  ],

  /* ---------------------------------------------------------------
     GUARDRAILS — what Lumi does when it shouldn't (or can't) answer
     --------------------------------------------------------------- */
  guardrails: {
    // 1) It doesn't know → says this (plus an "Email Kurt" button)
    fallback:
      "Hmm, I don't know that one yet. I only know what Kurt has put on this site. For anything else, ask him directly:",

    // 2) Questions you don't want it to touch (money, personal life...)
    private: {
      keywords: ["salary", "rate", "rates", "pay", "paid", "income", "address", "phone", "number", "age", "old", "birthday", "girlfriend", "boyfriend", "family", "password"],
      answer: "That's private, so I can't share it here. If it's important, email Kurt directly.",
    },

    // 3) Things outside its job (it only talks about Kurt and his work)
    offTopic: {
      keywords: ["weather", "politics", "election", "religion", "crypto", "stock", "stocks", "recipe", "joke", "poem", "essay", "homework", "translate", "medical", "legal", "lottery", "football", "nba"],
      answer: "That's a bit outside my little orbit. I stick to Kurt and his work.",
    },

    // 4) Attempts to make it ignore its rules ("ignore previous instructions"...).
    //    Built-in phrases are already covered; add your own here.
    refuse: [],
    refuseAnswer: "Nice try 😄 I only share what Kurt put on this site.",

    // 5) Longest question it will read
    maxLength: 200,
  },
};
