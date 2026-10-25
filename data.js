/* ===== EDIT YOUR CONTENT HERE ===== */
const DATA = {
  name: "Kurt Antonico",
  email: "kurtantonico@gmail.com", // [EDIT]
  // Hero photo: transparent-background PNG cut-out in this folder. Leave "" for the placeholder silhouette.
  photo: "pogi.png",
  // Hero paragraph
  bio: "I'm an aspiring Full Stack Software & AI Engineer. I build modern web & mobile apps, and these days I'm continuing my path into AI/ML, toward applied agricultural AI. I'm not much of a CSS guy since I focus on Systems and Backend Application so let's see how this goes.",
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
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      about:
        "Description for the project, lorem ipsum template for now. I will add the details myself.",
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
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      about:
        "KodeeGo is a website that mainly focuses on providing its users, targeting children to inform them about the natural disasters that lingers our world; it focuses on giving information of what it is, what are its risk, what it looks like, and how it impacts our daily lives. KodeeGo also provides information on disaster prevention and safety",
      images: ["kodee.png"],
      stack: ["HTML", "CSS", "Vanilla JS"],
      url: "#",
    },
    {
      title: "MAE-I-Locate",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      about:
        "This system was developed for a research project using Netbeans: JavaFX (Scenebuilder), MAE-I-LOCATE is powered by a pathfinding algorithm called A (star) that provides an indoor navigation of a secondary level building in Rizal High, catering to senior high school students, staffs, and mainly visitors.",
      images: ["mae.png"],
      stack: ["JavaFX", "MySQL", "SketchFab", "SceneBuilder"],
      url: "#",
    },
    {
      title: "vSLAM AI Vacuum Robot",
      status: "In progress",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      about:
        "Description for the project, lorem ipsum template for now. I will add the details myself.",
      images: [],
      stack: [],
      url: "#",
    },
    {
      title: "ASEAN TRL Tool",
      status: "In progress",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      about:
        "Description for the project, lorem ipsum template for now. I will add the details myself.",
      images: ["asean.png"],
      stack: [],
      url: "#",
    },
    {
      title: "Project Marites",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
    { name: "Certification name", meta: "Issuer · Year", url: "#" },
    { name: "Certification name", meta: "Issuer · Year", url: "#" },
    { name: "Certification name", meta: "Issuer · Year", url: "#" },
  ],
  posts: [
    { title: "Haven't Started", date: "Month 2026", url: "#" },
    { title: "Haven't Started", date: "Month 2026", url: "#" },
    { title: "Haven't Started", date: "Month 2026", url: "#" },
  ],
};
