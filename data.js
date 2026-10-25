/* ===== EDIT YOUR CONTENT HERE ===== */
const DATA = {
  name: "Kurt Antonico",
  email: "kurtantonico@gmail.com", // [EDIT]
  // Hero photo: transparent-background PNG cut-out in this folder. Leave "" for the placeholder silhouette.
  photo: "pogi.png",
  // Hero paragraph
  bio: "I'm an aspiring Software & AI Engineer. I build modern web & mobile apps, and these days I'm continuing my path into AI/ML, toward R&D Robotics",
  social: [
    ["github", "https://github.com/kurtantonico"],
    ["linkedin", "https://www.linkedin.com/in/kurt-antonico-325979312/"],
    ["substack", "https://substack.com/@kurt265575"],
  ],
  communities: ["AWS", "GDG", "n8n"],

  /* ---------------------------------------------------------------
     PROJECTS — each project has its own page (opens when you click the card).
     Only the first 3 show on the home page; the rest appear after "See all".

       title   name shown on the card and the project page
       status  small pill ("In progress"); delete the line if not needed
       desc    short text on the card
       about   longer text on the project page (leave "" to reuse desc)
       images  screenshots for the slider, e.g. ["agapay-1.png", "agapay-2.png"]
               (files go in this folder; leave [] to show placeholders)
       stack   ← ADD YOUR TECH STACK HERE, e.g. ["React", "Node.js", "PostgreSQL"]
               (shows at the bottom of the project page, under the description)
       url     live/demo/repo link; shows a "View project" link on the page.
               Leave "#" for none.
     --------------------------------------------------------------- */
  projects: [
    {
      title: "Agapay",
      status: "EGOV 2026 Hackathon",
      desc: "An Offline extension for EGoV Super App, powered by Bluetooth Low Engine (BLE)",
      about:
        "EGoV is good, unless there's no connection, and Agapay solves that problem, Agapay is an offline extension for EGoV Super App, powered by Bluetooth Low Engine (BLE), this app took 8 hours to build and Its main purpose is making EGoV Services available, you don't need to have a signal for it to work. Just a nearby device of another person, which already exists.",
      images: ["agapay.png"],
      stack: [
        "React Native",
        "Express.JS",
        "Node.JS",
        "Figma",
        "munim-bluetooth",
      ],
      url: "#",
    },
    {
      title: "KodeeGO",
      status: "RHS Website Competition 2023",
      desc: "A Disaster Risk Preparedness Information Website",
      about:
        "KodeeGo is a website that mainly focuses on providing its users, targeting children to inform them about the natural disasters that lingers our world; it focuses on giving information of what it is, what are its risk, what it looks like, and how it impacts our daily lives. KodeeGo also provides information on disaster prevention and safety",
      images: ["kodee.png"],
      stack: ["HTML", "CSS", "Vanilla JS"],
      url: "#",
    },
    {
      title: "MAE-I-Locate",
      status: "RHS Research Colloqium 2024",
      desc: "RHS was once the Guiness Holder as Largest Secondary School, many get lost so we built this",
      about:
        "This system was developed for a research project using Netbeans: JavaFX (Scenebuilder), MAE-I-LOCATE is powered by a pathfinding algorithm called A (star) that provides an indoor navigation of a secondary level building in Rizal High, catering to senior high school students, staffs, and mainly visitors.",
      images: ["mae.png"],
      stack: ["JavaFX", "MySQL", "SketchFab", "SceneBuilder"],
      url: "#",
    },
    {
      title: "vSLAM AI Vacuum Robot",
      status: "In progress",
      desc: "NDA for now",
      about: "Stay tuned!",
      images: [],
      stack: [],
      url: "#",
    },
    {
      title: "ASEAN TRL Tool",
      status: "In progress",
      desc: "A Web App for MsMe's in TRL for their business ideas",
      about:
        "Description for the project, lorem ipsum template for now. I will add the details myself.",
      images: [],
      stack: [],
      url: "#",
    },
    {
      title: "Project Marites",
      status: "UNESCO Youth Hackathon 2026",
      desc: "A Rumor Prevention App for traditional Gossips",
      about:
        "Description for the project, lorem ipsum template for now. I will add the details myself.",
      images: ["marites.png"],
      stack: [],
      url: "#",
    },
  ],
  stack: {
    "Cloud / DevOps": ["AWS", "Docker"],
    Frontend: ["React", "React Native"],
    Backend: ["Node.js", "Express.js", "PostgreSQL"],
    "Languages & AI": ["Python", "PyTorch", "TensorFlow", "Keras", "Sci-Kit"],
    Mobile: ["Xcode", "CocoPods"],
  },
  certs: [
    {
      name: "Claude Code 101",
      meta: "Anthropic · 2026",
      url: "https://verify.skilljar.com/c/k7et7yiv735d",
    },
    {
      name: "Working with OpenAI API",
      meta: "DataCamp · 2026",
      url: "https://www.datacamp.com/completed/statement-of-accomplishment/course/2299ae1ba590126bf968ae5e31b7fb6ea25b6570",
    },
    {
      name: "AWS Certified AI Practitioner",
      meta: "Amazon Web Services · Pending",
      url: "#",
    },
  ],
  posts: [
    {
      title:
        "People think SE is dead because of AI, But doing things just changed",
      date: "In the Works",
      url: "#",
    },
    {
      title:
        "Your titles and certificates are useless if you've never built something real",
      date: "Month 2026",
      url: "#",
    },
    { title: "Haven't Started", date: "Month 2026", url: "#" },
  ],

  /* ---------------------------------------------------------------
     EXPERIENCE — newest first. These three are placeholders: replace them.
     (Delete the whole array, or leave it empty [], to hide the section.)

       role     your title, e.g. "Student Developer"
       org      the organization / team / event
       period   when, e.g. "2025 — Present"
       desc     one or two sentences on what you did (optional)
       stack    tools you used, e.g. ["React", "Node.js"] (optional)
     --------------------------------------------------------------- */
  experiences: [
    {
      role: "Automation Deployment",
      org: "n8n",
      period: "Present",
      desc: "Think-Thank Department, Creating Industry level Automation and focusing on AI Integration",
      stack: [],
    },
    {
      role: "Internet of Things - Senior Associate",
      org: "AWS Cloud Computing PUP",
      period: "2025 — 2026",
      desc: "Integrated Software Utilization and Optimzation through Arduino, ESP32 projects",
      stack: [],
    },
    {
      role: "Developer at Style",
      org: "Freelance",
      period: "2022 — 2024",
      desc: "Creating Java Systems and Web Apps, NDA cannot add to projects",
      stack: [],
    },
  ],
};
