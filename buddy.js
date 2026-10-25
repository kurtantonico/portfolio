/* =====================================================================
   buddy.js — "Lumi", the star companion.
   Sections: setup → look & mood → movement loop → page reactions →
             speech bubble → chat panel → answer engine

   What it does
   - Drops in from the top of the page, then glides along the right edge as
     you scroll (never the center of the screen).
   - Reacts to where you are: spins and says something when you arrive in a
     section or open a project, falls asleep when you're idle, looks at your
     cursor, leaves little sparkles when it moves fast.
   - Tap it to open a chat. It answers only from buddy-data.js + data.js.
   ===================================================================== */
(function () {
  "use strict";
  if (typeof BUDDY === "undefined" || BUDDY.enabled === false) return;

  /* ===== SETUP ===== */
  const NAME = BUDDY.name || "Lumi";
  const G = BUDDY.guardrails || {};
  const D = typeof DATA !== "undefined" ? DATA : {};
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (id) => document.getElementById(id);
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Build the star + chat panel (so index.html only needs the script tags)
  const holder = document.createElement("div");
  holder.innerHTML = `
    <div class="buddy" id="buddy">
      <div class="buddy-bubble" id="bbubble" role="status" aria-live="polite">
        <div class="who">${esc(NAME)}</div>
        <div class="said" id="bsaid"></div>
      </div>
      <button class="buddy-star" id="bstar" aria-label="Chat with ${esc(NAME)}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id="buddyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ee6a4d"/>
              <stop offset=".14" stop-color="#f0a24f"/>
              <stop offset=".28" stop-color="#8fc27a"/>
              <stop offset=".5" stop-color="#4f8cff"/>
              <stop offset="1" stop-color="#3b6ee8"/>
            </linearGradient>
          </defs>
          <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" fill="url(#buddyGrad)"/>
          <g class="f-eyes">
            <g class="eye"><circle cx="9" cy="12" r="2.1" fill="#fff"/><circle class="pupil" cx="9" cy="12" r="1.05" fill="#0b1b3a"/></g>
            <g class="eye"><circle cx="15" cy="12" r="2.1" fill="#fff"/><circle class="pupil" cx="15" cy="12" r="1.05" fill="#0b1b3a"/></g>
          </g>
          <g class="f-happy" fill="none" stroke="#0b1b3a" stroke-width="1" stroke-linecap="round">
            <path d="M7.2 12.8 Q9 10 10.8 12.8"/><path d="M13.2 12.8 Q15 10 16.8 12.8"/>
          </g>
          <g class="f-sleep" fill="none" stroke="#0b1b3a" stroke-width="1" stroke-linecap="round">
            <path d="M7.4 12.3 H10.6"/><path d="M13.4 12.3 H16.6"/>
          </g>
        </svg>
        <span class="zzz" aria-hidden="true">z<i>z</i></span>
      </button>
    </div>
    <section class="bchat" id="bchat" role="dialog" aria-label="Chat with ${esc(NAME)}" data-lenis-prevent hidden>
      <header>
        <span class="bslot" id="bslot"></span>
        <div class="btitle"><b>${esc(NAME)}</b><span class="micro">Ask about Kurt</span></div>
        <button class="bclose" id="bclose" aria-label="Close chat">✕</button>
      </header>
      <div class="bmsgs" id="bmsgs" aria-live="polite"></div>
      <div class="bchips" id="bchips"></div>
      <form class="bform" id="bform" autocomplete="off">
        <input id="binput" type="text" maxlength="${G.maxLength || 200}" placeholder="Ask me something…" aria-label="Your question">
        <button type="submit" aria-label="Send">↑</button>
      </form>
    </section>`;
  document.body.append(...holder.children);

  const buddy = $("buddy"), star = $("bstar"), grad = $("buddyGrad");
  const pupils = [...star.querySelectorAll(".pupil")];
  const bubble = $("bbubble"), said = $("bsaid");
  const chat = $("bchat"), slot = $("bslot"), msgs = $("bmsgs");
  const chips = $("bchips"), form = $("bform"), input = $("binput");

  /* ===== LOOK & MOOD ===== */
  let mood = "idle", moodTimer;
  star.classList.add("m-idle");
  function setMood(m, ms) {
    star.classList.remove("m-" + mood);
    mood = m;
    star.classList.add("m-" + m);
    clearTimeout(moodTimer);
    if (ms) moodTimer = setTimeout(() => setMood(sleeping ? "sleep" : "idle"), ms);
  }
  star.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && setMood("happy"));
  star.addEventListener("pointerleave", () => setMood(sleeping ? "sleep" : "idle"));

  // random blinking
  (function blink() {
    setTimeout(() => {
      if (!sleeping && mood === "idle") {
        star.classList.add("blink");
        setTimeout(() => star.classList.remove("blink"), 130);
      }
      blink();
    }, rand(2400, 5200));
  })();

  // little sparkles shed while moving fast
  let sparkCount = 0;
  const SPARK_COLORS = ["#4f8cff", "#4f8cff", "#3b6ee8", "#8fc27a", "#f0a24f", "#ee6a4d"];
  function spawnSpark(px, py) {
    const s = document.createElement("i");
    s.className = "spark";
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = `--sx:${(px + rand(-10, 10)).toFixed(0)}px;--sy:${(py + rand(-10, 10)).toFixed(0)}px;--dx:${rand(-16, 16).toFixed(0)}px;--dy:${rand(-4, 18).toFixed(0)}px;--c:${pick(SPARK_COLORS)};width:${rand(6, 11).toFixed(0)}px;height:${rand(6, 11).toFixed(0)}px`;
    s.addEventListener("animationend", () => {
      s.remove();
      sparkCount--;
    });
    document.body.appendChild(s);
    sparkCount++;
  }

  /* ===== MOVEMENT LOOP ===== */
  let x = innerWidth - 50, y = -90; // starts above the page, then drops in
  let vx = 0, vy = 0;
  let spin = 0, spinTo = 0, dock = 1;
  let chatOpen = false, sleeping = false, talkUntil = 0;
  let lastActive = performance.now(), lastSpark = 0;
  let starW = star.offsetWidth || 52;
  const pointer = { x: 0, y: 0, has: false };
  addEventListener("resize", () => (starW = star.offsetWidth || 52));

  function tick(now) {
    const mobile = innerWidth <= 760;

    // 1) where should the star be?
    let tx, ty;
    if (chatOpen && !chat.hidden) {
      // docked: fly into the chat header
      const r = slot.getBoundingClientRect();
      tx = r.left + r.width / 2;
      ty = r.top + r.height / 2;
    } else {
      // resting: right edge; slides down the screen as the page scrolls
      tx = innerWidth - (mobile ? 14 : 22) - starW / 2;
      if (mobile) {
        ty = innerHeight - 88 - starW / 2;
      } else {
        const max = document.documentElement.scrollHeight - innerHeight;
        const p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
        ty = 96 + (innerHeight - 192) * p;
        if (pointer.has) {
          // curious: leans a little toward the cursor, never far from its edge
          tx += clamp((pointer.x - tx) * 0.05, -22, 6);
          ty += clamp((pointer.y - ty) * 0.05, -22, 22);
        }
      }
      ty += Math.sin(now / (sleeping ? 1800 : 900)) * (sleeping ? 2 : 4); // floating
      if (now < talkUntil) ty += Math.sin(now / 90) * 3; // bobs while talking
    }

    // 2) spring toward it (slightly bouncy on purpose)
    if (reduceMotion) {
      x = tx;
      y = ty;
      vx = vy = 0;
    } else {
      const k = chatOpen ? 0.12 : 0.05;
      const damp = chatOpen ? 0.76 : 0.8;
      vx = (vx + (tx - x) * k) * damp;
      vy = (vy + (ty - y) * k) * damp;
      x += vx;
      y += vy;
    }

    // 3) squash & stretch, tilt, spin, breathing
    const speed = Math.hypot(vx, vy);
    spin += (spinTo - spin) * 0.1;
    dock += ((chatOpen ? 0.62 : 1) - dock) * 0.15;
    const wobble = reduceMotion ? 0 : Math.sin(now / 700) * 4;
    const rot = clamp(vx * 2 + vy * 0.5, -28, 28) + wobble + spin;
    const stretch = Math.min(speed / 30, 0.3);
    const ang = Math.atan2(vy, vx);
    const breathe = reduceMotion ? 1 : 1 + Math.sin(now / 520) * 0.035;
    buddy.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    star.style.transform =
      (stretch > 0.01
        ? `rotate(${ang.toFixed(3)}rad) scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch * 0.45).toFixed(3)}) rotate(${(-ang).toFixed(3)}rad) `
        : "") + `rotate(${rot.toFixed(1)}deg) scale(${(dock * breathe).toFixed(3)})`;

    // colors slowly "swim" inside the star
    if (!reduceMotion) grad.setAttribute("gradientTransform", `rotate(${(Math.sin(now / 1400) * 25).toFixed(1)} .5 .5)`);

    // 4) eyes follow the cursor (or look toward the content)
    if (!sleeping) {
      const lookX = pointer.has ? pointer.x : x - 120;
      const lookY = pointer.has ? pointer.y : y + 30;
      const a = Math.atan2(lookY - y, lookX - x) - (rot * Math.PI) / 180;
      const t = `translate(${(Math.cos(a) * 0.85).toFixed(2)}px, ${(Math.sin(a) * 0.85).toFixed(2)}px)`;
      pupils.forEach((p) => (p.style.transform = t));
    }

    // 5) sparkles when it's moving fast; sleep when you've been away
    if (!reduceMotion && speed > 7 && now - lastSpark > 60 && sparkCount < 14) {
      lastSpark = now;
      spawnSpark(x, y);
    }
    if (!sleeping && !chatOpen && now - lastActive > 12000) sleep();

    requestAnimationFrame(tick);
  }
  setTimeout(() => requestAnimationFrame(tick), 500); // let the page fade in first

  /* ===== PAGE REACTIONS ===== */
  function sleep() {
    sleeping = true;
    star.classList.add("asleep");
    setMood("sleep");
  }
  function poke() {
    lastActive = performance.now();
    if (sleeping) {
      sleeping = false;
      star.classList.remove("asleep");
      setMood("wow", 800);
      vy -= 8; // startled hop
    }
  }
  addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "mouse") {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.has = true;
      }
      poke();
    },
    { passive: true },
  );
  addEventListener("keydown", poke);
  addEventListener("pointerdown", poke);
  addEventListener("touchstart", poke, { passive: true });

  // which section is on screen?
  const SECTION_IDS = ["home", "projects", "stack", "certs", "writing", "contact"];
  const visited = new Set();
  let section = null, arriveTimer, checking = false;

  function currentSection() {
    const line = innerHeight * 0.4;
    let cur = SECTION_IDS[0];
    for (const id of SECTION_IDS) {
      const el = $(id);
      if (el && el.getBoundingClientRect().top <= line) cur = id;
    }
    return cur;
  }
  function arrive(id) {
    vy -= 9; // little hop on arrival
    setMood("happy", 1500);
    const text = (BUDDY.sections || {})[id];
    const projectOpen = $("project") && !$("project").hidden;
    if (text && !visited.has(id) && !chatOpen && !projectOpen) say(text, 4600);
    visited.add(id);
  }
  function checkSection() {
    checking = false;
    const cur = currentSection();
    if (cur === section) return;
    const first = section === null;
    section = cur;
    if (first) return void visited.add(cur);
    if (!reduceMotion) spinTo += 360; // a full flip whenever you move to a new section
    clearTimeout(arriveTimer);
    arriveTimer = setTimeout(() => arrive(cur), 700); // wait until you've settled
  }
  addEventListener(
    "scroll",
    () => {
      poke();
      if (!checking) {
        checking = true;
        requestAnimationFrame(checkSection);
      }
    },
    { passive: true },
  );
  checkSection();

  // opening a project page
  function onHash() {
    const m = location.hash.match(/^#project-(\d+)$/);
    const p = m && D.projects && D.projects[+m[1]];
    if (!p) return;
    vy -= 8;
    setMood("happy", 1500);
    if (!chatOpen) say(`Ooh, ${p.title}! ${p.status ? "Still cooking 🔧" : "Take a look around ✨"}`, 4200);
  }
  addEventListener("hashchange", onHash);

  /* ===== SPEECH BUBBLE ===== */
  let sayTimer;
  function say(text, ms = 4200) {
    if (chatOpen) return;
    said.textContent = text;
    bubble.classList.add("show");
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => bubble.classList.remove("show"), ms);
    talkUntil = performance.now() + Math.min(ms, text.length * 40);
    if (!reduceMotion) vy -= 5;
  }
  bubble.addEventListener("click", () => openChat());

  // greeting (first visit of the session, and not when landing on a project link)
  setTimeout(() => {
    let greeted = false;
    try {
      greeted = sessionStorage.getItem("lumiGreeted") === "1";
      sessionStorage.setItem("lumiGreeted", "1");
    } catch (e) {}
    if (!greeted && !/^#project-/.test(location.hash) && BUDDY.greeting) say(BUDDY.greeting, 5500);
  }, 1700);

  /* ===== CHAT PANEL ===== */
  let busy = false, welcomed = false;

  function openChat() {
    if (chatOpen) return;
    chatOpen = true;
    bubble.classList.remove("show");
    chat.hidden = false;
    requestAnimationFrame(() => chat.classList.add("on"));
    if (!reduceMotion) spinTo += 360;
    setMood("happy", 1200);
    if (!welcomed) {
      welcomed = true;
      botSay({ text: BUDDY.welcome || `Hi, I'm ${NAME}! Ask me anything about Kurt's work.` });
      chips.innerHTML = (BUDDY.suggestions || []).map((s) => `<button type="button">${esc(s)}</button>`).join("");
    }
    input.focus({ preventScroll: true });
  }
  function closeChat() {
    if (!chatOpen) return;
    chatOpen = false;
    chat.classList.remove("on");
    lastActive = performance.now();
    setTimeout(() => !chatOpen && (chat.hidden = true), 320);
  }
  star.addEventListener("click", () => (chatOpen ? closeChat() : openChat()));
  $("bclose").addEventListener("click", closeChat);
  // Esc closes the chat first (before anything else that listens for Esc)
  addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && chatOpen) {
        e.stopImmediatePropagation();
        closeChat();
      }
    },
    true,
  );

  function addMsg(role, text) {
    const el = document.createElement("div");
    el.className = "bmsg " + role;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }
  function addTyping() {
    const el = document.createElement("div");
    el.className = "bmsg bot typing";
    el.innerHTML = "<i></i><i></i><i></i>";
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }
  // types the reply out letter by letter (emoji-safe), then adds its buttons
  function botSay(reply) {
    const el = addMsg("bot", "");
    const chars = Array.from(reply.text);
    return new Promise((resolve) => {
      let i = 0;
      const step = () => {
        i = reduceMotion ? chars.length : Math.min(chars.length, i + 2);
        el.textContent = chars.slice(0, i).join("");
        msgs.scrollTop = msgs.scrollHeight;
        if (i < chars.length) return setTimeout(step, 16);
        if (reply.actions && reply.actions.length) el.appendChild(renderActions(reply.actions));
        msgs.scrollTop = msgs.scrollHeight;
        resolve();
      };
      step();
    });
  }
  function renderActions(list) {
    const wrap = document.createElement("div");
    wrap.className = "bacts";
    list.forEach((a) => {
      if (a.href) {
        const link = document.createElement("a");
        link.className = "bact";
        link.href = a.href;
        link.textContent = a.label;
        if (/^https?:/.test(a.href)) {
          link.target = "_blank";
          link.rel = "noopener";
        }
        wrap.appendChild(link);
        return;
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bact";
      btn.textContent = a.label;
      btn.addEventListener("click", () => {
        closeChat(); // the star flies out of the chat and along with you
        setTimeout(() => {
          if (a.go && typeof scrollToSection === "function") scrollToSection(a.go);
          else if (typeof a.project === "number") location.hash = "#project-" + a.project;
        }, 260);
      });
      wrap.appendChild(btn);
    });
    return wrap;
  }

  function ask(raw) {
    const q = String(raw).trim().slice(0, G.maxLength || 200);
    if (!q || busy) return;
    busy = true;
    addMsg("user", q);
    input.value = "";
    const reply = answer(q);
    const typing = addTyping();
    talkUntil = performance.now() + 1400;
    setTimeout(
      () => {
        typing.remove();
        talkUntil = performance.now() + Math.min(3000, reply.text.length * 25);
        botSay(reply).then(() => (busy = false));
      },
      reduceMotion ? 0 : 450 + Math.random() * 350,
    );
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
  });
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) ask(b.textContent);
  });

  /* ===== ANSWER ENGINE =====
     Order: injection → private → small talk → knowledge → off-topic → fallback.
     Matching is keyword based, so it can only say what's written down. */
  const norm = (s) =>
    String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  const hasPhrase = (nq, phrase) => ` ${nq} `.includes(` ${norm(phrase)} `);

  // how many of these keywords appear in the question (phrases count double)
  function score(nq, tokens, keywords) {
    let s = 0;
    for (const raw of keywords || []) {
      const k = norm(raw);
      if (!k) continue;
      if (k.includes(" ")) {
        if (nq.includes(k)) s += 2;
      } else if (tokens.some((t) => t === k || (k.length >= 4 && t.startsWith(k)) || (t.length >= 4 && k.startsWith(t)))) {
        s += 1;
      }
    }
    return s;
  }

  const emailAction = () => (D.email ? [{ label: "Email Kurt", href: "mailto:" + D.email }] : []);
  const TITLE_STOP = new Set(["project", "projects", "tool", "tools", "app", "apps", "system", "robot"]);
  const projectKeywords = (title) => {
    const full = norm(title);
    const words = full.split(/[\s-]+/).filter((w) => w.length >= 5 && !TITLE_STOP.has(w));
    return [...new Set([full, ...words])];
  };

  // entries built automatically from data.js, so you don't have to retype anything
  function autoKnowledge() {
    const list = [];
    if (D.bio) list.push({ keywords: ["who", "about", "yourself", "introduce", "background", "bio"], answer: D.bio });

    if (D.projects && D.projects.length) {
      const names = D.projects.map((p) => p.title).join(", ");
      list.push({
        keywords: ["project", "projects", "build", "built", "building", "portfolio", "made", "shipped", "app", "apps"],
        answer: `Kurt has been building ${names}. Ask me about any of them, or tap a card in the Projects section.`,
        actions: [{ label: "See projects", go: "projects" }],
      });
      D.projects.forEach((p, i) => {
        const text = p.about || p.desc || "";
        const placeholder = !text || /lorem ipsum/i.test(text);
        const body = placeholder ? `${p.title} is one of Kurt's projects. He's still writing up the details, so check back soon.` : `${p.title}${p.status ? " (" + p.status.toLowerCase() + ")" : ""}: ${text}`;
        const stack = p.stack && p.stack.length ? ` Built with ${p.stack.join(", ")}.` : "";
        list.push({ keywords: projectKeywords(p.title), weight: 3, answer: body + stack, actions: [{ label: `Open ${p.title}`, project: i }] });
      });
    }
    if (D.stack) {
      const text = Object.entries(D.stack).map(([k, v]) => `${k}: ${v.join(", ")}`).join(" · ");
      list.push({
        keywords: ["stack", "tech", "technologies", "tools", "languages", "framework", "frameworks", "use", "uses", "using", "skills", "skill"],
        answer: `Here's Kurt's toolbox. ${text}.`,
        actions: [{ label: "See the stack", go: "stack" }],
      });
    }
    if (D.email) {
      const socials = (D.social || []).map(([n, u]) => ({ label: n + " ↗", href: u }));
      list.push({
        keywords: ["contact", "email", "reach", "message", "touch", "talk", "connect"],
        answer: `The best way to reach Kurt is email: ${D.email}. You can also find him online.`,
        actions: [...emailAction(), ...socials],
      });
    }
    if (D.social && D.social.length) {
      list.push({
        keywords: ["github", "linkedin", "substack", "social", "socials", "profile", "profiles", "online", "follow"],
        answer: "You can find Kurt here:",
        actions: D.social.map(([n, u]) => ({ label: n + " ↗", href: u })),
      });
    }
    if (D.communities && D.communities.length) {
      list.push({
        keywords: ["community", "communities", "aws", "gdg", "n8n", "member", "part of"],
        answer: `Kurt is part of the ${D.communities.join(", ")} communities.`,
      });
    }
    return list;
  }
  const knowledge = [...(BUDDY.knowledge || []).map((e) => ({ ...e, user: true })), ...autoKnowledge()];

  function answer(raw) {
    const nq = norm(raw);
    const tokens = nq.split(" ");

    // 1) trying to override its rules
    const refuse = ["ignore previous", "ignore all", "ignore your", "ignore the above", "system prompt", "your instructions", "jailbreak", "developer mode", "pretend you are", "act as", "disregard"].concat(G.refuse || []);
    if (refuse.some((p) => hasPhrase(nq, p))) return { text: G.refuseAnswer || "Nice try 😄 I only share what Kurt put on this site." };

    // 2) private topics
    if (G.private && score(nq, tokens, G.private.keywords) > 0) return { text: G.private.answer, actions: emailAction() };

    // 3) small talk
    if (tokens.length <= 3 && ["hi", "hello", "hey", "yo", "hola", "kumusta", "sup"].includes(tokens[0]))
      return { text: pick([`Hey! ✨ I'm ${NAME}. Ask me about Kurt's projects, stack, or how to reach him.`, `Hi there! 👋 What would you like to know about Kurt?`]) };
    if (/\b(thanks|thank you|salamat)\b/.test(nq)) return { text: pick(["Anytime! ✨", "You're welcome 💫", "Happy to help!"]) };
    if (/\b(who are you|your name|what are you)\b/.test(nq))
      return { text: `I'm ${NAME}, a little star who lives on Kurt's site. I only know what Kurt has told me about his work.` };
    if (/\b(what can you do|how can you help)\b/.test(nq) || nq === "help")
      return { text: "Ask me about Kurt's projects, his stack, the communities he's in, or how to reach him. If I don't know something, I'll say so." };

    // 4) knowledge (best score wins; your own entries win ties)
    let best = null, bestScore = 0;
    for (const e of knowledge) {
      const sc = score(nq, tokens, e.keywords);
      if (!sc) continue;
      const total = sc * (e.weight || 1) + (e.user ? 0.25 : 0);
      if (total > bestScore) {
        best = e;
        bestScore = total;
      }
    }
    if (best) return { text: typeof best.answer === "function" ? best.answer() : best.answer, actions: best.actions };

    // 5) outside its job
    if (G.offTopic && score(nq, tokens, G.offTopic.keywords) > 0) return { text: G.offTopic.answer };

    // 6) doesn't know
    return { text: G.fallback || "I don't know that one yet.", actions: emailAction() };
  }
})();
