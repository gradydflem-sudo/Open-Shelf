const SUPABASE_URL = "https://fabucdcrmpdvyukflggx.supabase.co";
const SUPABASE_KEY = "sb_publishable_aPWFDpPUCanreVvU_y9mdg_K3_sH-AV";
const SITE_URL = "https://common-pages.com/";
const SUBSTACK_PUBLISH_URL = "https://substack.com/publish";
const OWNER_EMAIL = "gradydflem@gmail.com";
const CATEGORIES = ["Essays", "Memoirs", "Fiction", "Notes"];
const WRITING_SPRINT_SECONDS = 60;

const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

let posts = [];
let account = null;
let activeCategory = "All";
let editingPostId = null;
let refreshStarted = false;

const accountForm = document.querySelector("#accountForm");
const accountNameInput = document.querySelector("#accountNameInput");
const accountEmailInput = document.querySelector("#accountEmailInput");
const accountPasswordInput = document.querySelector("#accountPasswordInput");
const accountMessage = document.querySelector("#accountMessage");
const accountButton = document.querySelector("#accountButton");
const accountCard = document.querySelector("#accountCard");
const accountRole = document.querySelector("#accountRole");
const accountName = document.querySelector("#accountName");
const signOutButton = document.querySelector("#signOutButton");
const libraryNavLink = document.querySelector("#libraryNavLink");
const shareButton = document.querySelector("#shareButton");
const shareStatus = document.querySelector("#shareStatus");
const categoryList = document.querySelector("#categoryList");
const categoryInput = document.querySelector("#categoryInput");
const postGrid = document.querySelector("#postGrid");
const postForm = document.querySelector("#postForm");
const publishNote = document.querySelector("#publishNote");
const accountGate = document.querySelector("#accountGate");
const titleInput = document.querySelector("#titleInput");
const authorInput = document.querySelector("#authorInput");
const submitButton = document.querySelector("#submitButton");
const bodyInput = document.querySelector("#bodyInput");
const substackInput = document.querySelector("#substackInput");
const substackNote = document.querySelector("#substackNote");
const fileInput = document.querySelector("#fileInput");
const fileName = document.querySelector("#fileName");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const feedTitle = document.querySelector("#feedTitle");
const activeCategoryLabel = document.querySelector("#activeCategoryLabel");
const readerPanel = document.querySelector("#readerPanel");
const readerArticle = document.querySelector("#readerArticle");
const closeReader = document.querySelector("#closeReader");
const librarySection = document.querySelector("#library");
const libraryList = document.querySelector("#libraryList");
const exportButton = document.querySelector("#exportButton");
const importInput = document.querySelector("#importInput");
const resetButton = document.querySelector("#resetButton");
const clearForm = document.querySelector("#clearForm");
const practiceMenu = document.querySelector("#practiceMenu");
const practiceWorkbench = document.querySelector("#practiceWorkbench");
const practiceLayout = document.querySelector("#practiceLayout");
const practiceCards = document.querySelectorAll("[data-practice-mode]");
const practiceBackButton = document.querySelector("#practiceBackButton");
const practiceSelects = document.querySelector(".practice-selects");
const practiceDifficulty = document.querySelector("#practiceDifficulty");
const practiceTopic = document.querySelector("#practiceTopic");
const practiceTimerControl = document.querySelector("#practiceTimerControl");
const practiceTimer = document.querySelector("#practiceTimer");
const practiceCustomTimerControl = document.querySelector("#practiceCustomTimerControl");
const practiceCustomTimer = document.querySelector("#practiceCustomTimer");
const practiceModeLabel = document.querySelector("#practiceModeLabel");
const practiceTitle = document.querySelector("#practiceTitle");
const practicePrompt = document.querySelector("#practicePrompt");
const characterTrack = document.querySelector("#characterTrack");
const practiceTime = document.querySelector("#practiceTime");
const practiceWpm = document.querySelector("#practiceWpm");
const practiceAccuracy = document.querySelector("#practiceAccuracy");
const practiceMistakes = document.querySelector("#practiceMistakes");
const practiceMetricLabels = document.querySelectorAll(".metrics-grid span");
const practiceInputLabel = document.querySelector("#practiceInputLabel");
const practiceInput = document.querySelector("#practiceInput");
const practiceFeedback = document.querySelector("#practiceFeedback");
const practiceBest = document.querySelector("#practiceBest");
const practiceResults = document.querySelector("#practiceResults");
const practiceStartButton = document.querySelector("#practiceStartButton");
const practiceFinishButton = document.querySelector("#practiceFinishButton");
const practiceNextButton = document.querySelector("#practiceNextButton");
const practiceRetryButton = document.querySelector("#practiceRetryButton");
const practiceLeaderboard = document.querySelector("#practiceLeaderboard");
const archivistGame = document.querySelector("#archivistGame");
const archivistMode = document.querySelector("#archivistMode");
const archivistTags = document.querySelector("#archivistTags");
const archivistStage = document.querySelector("#archivistStage");
const archivistStartCard = document.querySelector("#archivistStartCard");
const archivistInput = document.querySelector("#archivistInput");
const archivistFeedback = document.querySelector("#archivistFeedback");
const archivistScore = document.querySelector("#archivistScore");
const archivistSaved = document.querySelector("#archivistSaved");
const archivistLost = document.querySelector("#archivistLost");
const archivistStreak = document.querySelector("#archivistStreak");
const archivistTime = document.querySelector("#archivistTime");
const archivistStartButton = document.querySelector("#archivistStartButton");
const archivistBellButton = document.querySelector("#archivistBellButton");
const archivistResetButton = document.querySelector("#archivistResetButton");
const archivistUpgrades = document.querySelector("#archivistUpgrades");
const archivistResult = document.querySelector("#archivistResult");
const tycoonGame = document.querySelector("#tycoonGame");
const tycoonNewAssignment = document.querySelector("#tycoonNewAssignment");
const tycoonResetProgress = document.querySelector("#tycoonResetProgress");
const tycoonViews = document.querySelector("#tycoonViews");
const tycoonSubscribers = document.querySelector("#tycoonSubscribers");
const tycoonRevenue = document.querySelector("#tycoonRevenue");
const tycoonReputation = document.querySelector("#tycoonReputation");
const tycoonEnergy = document.querySelector("#tycoonEnergy");
const tycoonAssignment = document.querySelector("#tycoonAssignment");
const tycoonDraft = document.querySelector("#tycoonDraft");
const tycoonWordCount = document.querySelector("#tycoonWordCount");
const tycoonKeywordCount = document.querySelector("#tycoonKeywordCount");
const tycoonTimer = document.querySelector("#tycoonTimer");
const tycoonFeedback = document.querySelector("#tycoonFeedback");
const tycoonPublish = document.querySelector("#tycoonPublish");
const tycoonMoveToPublish = document.querySelector("#tycoonMoveToPublish");
const tycoonResult = document.querySelector("#tycoonResult");
const tycoonShop = document.querySelector("#tycoonShop");
const tycoonLog = document.querySelector("#tycoonLog");
const ownerOnlyControls = [
  exportButton,
  importInput.closest(".import-button"),
  resetButton
];
const practiceData = window.CommonPagesPracticeData || {
  spanishPrompts: [],
  typingPassages: [],
  writingPrompts: [],
  archivistItems: [],
  microFiction: {
    genres: [],
    tropes: [],
    audiences: [],
    wordSets: [],
    specialEvents: []
  }
};
const practiceModeCopy = {
  "spanish-retype": {
    label: "Spanish Retype",
    title: "Type the Spanish phrase exactly.",
    inputLabel: "Retype the phrase"
  },
  typing: {
    label: "Typing Practice",
    title: "Type the passage exactly.",
    inputLabel: "Type the passage"
  },
  "spanish-translate": {
    label: "Spanish Translation",
    title: "Translate the phrase into English.",
    inputLabel: "Your translation"
  },
  "writing-sprint": {
    label: "Writing Sprint",
    title: "Write from the prompt.",
    inputLabel: "Your response"
  },
  archivist: {
    label: "The Rogue-lite Archivist",
    title: "Type the correct category tag.",
    inputLabel: "Category tag"
  }
};
const ARCHIVIST_TAGS = [
  "Cursed",
  "Royal",
  "Elven",
  "Scientific",
  "Historical",
  "Forbidden",
  "Medical",
  "Legal",
  "Mythic",
  "Political",
  "Personal",
  "Prophecy",
  "Map",
  "Treaty",
  "Spell",
  "Diary",
  "Invention"
];
const ARCHIVIST_MODES = {
  calm: {
    label: "Calm Mode",
    timeLimit: 90,
    speed: 24,
    spawnEvery: 3400,
    activeLimit: 2,
    maxLost: 5,
    maxTier: 1,
    scoreMultiplier: 1,
    tags: ["Royal", "Scientific", "Treaty", "Legal", "Diary", "Map", "Medical", "Spell", "Historical", "Personal", "Mythic", "Invention"]
  },
  normal: {
    label: "Normal Mode",
    timeLimit: 90,
    speed: 34,
    spawnEvery: 2600,
    activeLimit: 3,
    maxLost: 4,
    maxTier: 2,
    scoreMultiplier: 1.2,
    tags: ["Cursed", "Royal", "Elven", "Scientific", "Historical", "Forbidden", "Medical", "Legal", "Mythic", "Political", "Personal", "Prophecy", "Map", "Treaty", "Spell", "Diary", "Invention"]
  },
  archivist: {
    label: "Archivist Mode",
    timeLimit: 100,
    speed: 44,
    spawnEvery: 2100,
    activeLimit: 4,
    maxLost: 3,
    maxTier: 3,
    scoreMultiplier: 1.45,
    tags: ARCHIVIST_TAGS
  }
};
const ARCHIVIST_UPGRADES = [
  {
    id: "slower-scroll",
    name: "Slower Scroll",
    text: "Items fall 18% more slowly.",
    apply() {
      archivistState.speedMultiplier *= 0.82;
    }
  },
  {
    id: "better-lantern",
    name: "Better Lantern",
    text: "Key clue words glow on new items.",
    apply() {
      archivistState.lantern = true;
    }
  },
  {
    id: "extra-shelf",
    name: "Extra Shelf",
    text: "One extra missed item is allowed.",
    apply() {
      archivistState.maxLost += 1;
    }
  },
  {
    id: "index-cards",
    name: "Index Cards",
    text: "Show the possible category tags.",
    apply() {
      archivistState.indexCards = true;
    }
  },
  {
    id: "apprentice-helper",
    name: "Apprentice Helper",
    text: "Automatically saves one falling item.",
    apply() {
      archivistState.autoSaveCharges += 1;
    }
  },
  {
    id: "archive-bell",
    name: "Archive Bell",
    text: "Unlock a brief pause button.",
    apply() {
      archivistState.bellCharges += 1;
    }
  },
  {
    id: "magnifying-glass",
    name: "Magnifying Glass",
    text: "Reveal a first-letter hint for the lowest item.",
    apply() {
      archivistState.hints = true;
    }
  }
];
const ARCHIVIST_CLUES = {
  Cursed: ["cursed", "red ink", "afraid", "reappears"],
  Royal: ["crown", "king", "queen", "palace", "royal"],
  Elven: ["elven", "bark", "song", "sung"],
  Scientific: ["notebook", "measurements", "report", "abstract", "comparing"],
  Historical: ["chronicle", "historical", "witness", "first", "old empire"],
  Forbidden: ["forbidden", "banned", "removed"],
  Medical: ["doctor", "symptoms", "surgeon", "medical", "fever", "patient"],
  Legal: ["rights", "brief", "ruling", "legal", "court", "signature"],
  Mythic: ["mythic", "hymn", "moon", "oath", "north wind"],
  Political: ["campaign", "senators", "election", "vote", "taxes"],
  Personal: ["family", "private", "birthday", "apology", "son"],
  Prophecy: ["prophecy", "forecasting", "next age"],
  Map: ["map", "chart", "route", "exits", "border"],
  Treaty: ["treaty", "agreement", "clauses", "signed"],
  Spell: ["spell", "spoken aloud", "mirror-script", "activating"],
  Diary: ["diary", "journal", "entry", "dates"],
  Invention: ["machine", "designed", "powered", "invention", "sorts"]
};
const TYCOON_SAVE_KEY = "commonPagesMicroFictionTycoon";
const TYCOON_UPGRADES = [
  {
    id: "organized-desk",
    name: "Organized Desk",
    cost: 45,
    text: "Cleaner notes give every story a small reputation lift.",
    requires: null
  },
  {
    id: "vintage-oak-desk",
    name: "Vintage Oak Desk",
    cost: 130,
    text: "Your platform feels more established. Views rise on each story.",
    requires: "organized-desk"
  },
  {
    id: "editors-desk",
    name: "Editor's Desk",
    cost: 320,
    text: "Better revision habits increase reputation and subscribers.",
    requires: "vintage-oak-desk"
  },
  {
    id: "legendary-author-desk",
    name: "Legendary Author Desk",
    cost: 800,
    text: "A prestige upgrade that boosts every published result.",
    requires: "editors-desk"
  },
  {
    id: "better-keyboard",
    name: "Better Keyboard",
    cost: 70,
    text: "Typing speed bonus for faster drafts."
  },
  {
    id: "research-notebook",
    name: "Research Notebook",
    cost: 90,
    text: "Unlocks historical, nonfiction-flavored, and civic assignments."
  },
  {
    id: "coffee-machine",
    name: "Coffee Machine",
    cost: 120,
    text: "Raises creative energy and restores one energy after strong stories."
  },
  {
    id: "editorial-calendar",
    name: "Editorial Calendar",
    cost: 160,
    text: "Special events appear more often."
  },
  {
    id: "cover-designer",
    name: "Cover Designer",
    cost: 220,
    text: "Better covers increase views."
  },
  {
    id: "newsletter-system",
    name: "Newsletter System",
    cost: 260,
    text: "More readers subscribe after each story."
  },
  {
    id: "archive-room",
    name: "Archive Room",
    cost: 300,
    text: "Unlocks older prompts, rare tropes, and stranger combinations."
  },
  {
    id: "translation-desk",
    name: "Translation Desk",
    cost: 360,
    text: "Unlocks language-learner and Spanish-inflected assignments."
  },
  {
    id: "serial-analytics",
    name: "Serial Analytics",
    cost: 480,
    text: "Turns consistent work into more revenue."
  }
];
let practiceState = {
  mode: "spanish-retype",
  item: null,
  target: "",
  startedAt: null,
  elapsed: 0,
  finished: false,
  timerId: null,
  lastResult: null
};
let archivistState = {
  running: false,
  paused: false,
  loopId: null,
  lastFrame: 0,
  lastSpawn: 0,
  nextId: 1,
  mode: "normal",
  items: [],
  seenIds: [],
  score: 0,
  saved: 0,
  lost: 0,
  wrong: 0,
  streak: 0,
  bestStreak: 0,
  timeLeft: 90,
  maxLost: 4,
  speedMultiplier: 1,
  indexCards: false,
  lantern: false,
  hints: false,
  autoSaveCharges: 0,
  bellCharges: 0,
  upgrades: [],
  nextUpgradeAt: 4
};
let tycoonState = null;
let tycoonTimerId = null;

function isOwner() {
  return account?.email?.toLowerCase() === OWNER_EMAIL;
}

function isSignedIn() {
  return Boolean(account?.id);
}

function ownsPost(post) {
  return isSignedIn() && post.submitted_by === account.id;
}

function canEditPost(post) {
  return ownsPost(post);
}

function canDeletePost(post) {
  return isOwner() || ownsPost(post);
}

function roleLabel() {
  if (!isSignedIn()) return "Guest";
  return isOwner() ? "Owner" : "Reader";
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}

function slugCategory(category) {
  return `cat-${category.toLowerCase()}`;
}

function displayCredit(post) {
  return post.submitted_by === account?.id && isOwner() ? "Owner" : "Contributor";
}

function excerpt(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 150 ? `${clean.slice(0, 147)}...` : clean;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}

function linkifyText(value) {
  return String(value)
    .split(/(https?:\/\/[^\s]+)/g)
    .map((part) => {
      if (!/^https?:\/\//i.test(part)) return escapeHTML(part);
      const safeUrl = escapeHTML(part);
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`;
    })
    .join("");
}

function formatReaderBody(text) {
  return String(text)
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${linkifyText(paragraph)}</p>`)
    .join("");
}

function getShareUrl() {
  if (location.protocol === "file:") return SITE_URL;
  return location.origin + location.pathname;
}

async function shareSite() {
  const shareUrl = getShareUrl();
  const shareText = `Read Common Pages: ${shareUrl}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Common Pages",
        text: "Read Common Pages",
        url: shareUrl
      });
      shareStatus.textContent = "Ready to share.";
    } catch {
      shareStatus.textContent = "";
    }
    return;
  }

  window.location.href = `sms:?&body=${encodeURIComponent(shareText)}`;
}

function normalizePost(post) {
  return {
    ...post,
    date: post.created_at || new Date().toISOString()
  };
}

async function loadAccount() {
  if (!db) {
    account = null;
    return;
  }

  const { data, error } = await db.auth.getSession();
  if (error) throw error;
  account = data.session?.user || null;
}

async function loadPosts() {
  if (!db) {
    posts = [];
    postGrid.innerHTML = `<div class="empty-state">Supabase did not load. Refresh the page, then try again.</div>`;
    return;
  }

  let query = db
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) {
    postGrid.innerHTML = `<div class="empty-state">Could not load writing yet. ${escapeHTML(error.message)}</div>`;
    posts = [];
    return;
  }

  posts = (data || []).map(normalizePost);
}

function getVisiblePosts() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = posts.filter((post) => {
    if (post.status !== "published") return false;
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const haystack = `${post.title} ${post.author} ${post.body}`.toLowerCase();
    return matchesCategory && (!term || haystack.includes(term));
  });

  return filtered.sort((a, b) => {
    if (sortSelect.value === "oldest") return new Date(a.created_at) - new Date(b.created_at);
    if (sortSelect.value === "title") return a.title.localeCompare(b.title);
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

function renderAccount() {
  if (isSignedIn()) {
    const displayName = account.user_metadata?.display_name || account.email;
    accountForm.classList.add("hidden");
    accountCard.classList.remove("hidden");
    accountRole.textContent = roleLabel();
    accountName.textContent = `${displayName} · ${account.email}`;
  } else {
    accountForm.classList.remove("hidden");
    accountCard.classList.add("hidden");
  }
}

function renderAccess() {
  const owner = isOwner();
  const signedIn = isSignedIn();

  librarySection.classList.toggle("hidden", !signedIn);
  libraryNavLink.classList.toggle("hidden", !signedIn);
  postForm.classList.toggle("hidden", !signedIn);
  accountGate.classList.toggle("hidden", signedIn);
  ownerOnlyControls.forEach((control) => control?.classList.toggle("hidden", !owner));

  if (!signedIn) {
    publishNote.textContent = "Guests can read published pieces. Create an account above to submit writing for review.";
  } else if (owner) {
    publishNote.textContent = "Owner view: your pieces publish immediately, and you can approve or delete submissions in the Library.";
  } else if (editingPostId) {
    publishNote.textContent = "Edit your piece here. Published reader edits go back to pending approval before appearing publicly.";
  } else {
    publishNote.textContent = "Reader account: your submission will go to the owner for approval before it appears publicly.";
  }

  submitButton.textContent = editingPostId ? "Save Changes" : owner ? "Publish" : "Submit for Approval";
  clearForm.textContent = editingPostId ? "Cancel Edit" : "Clear";
}

function renderCategories() {
  const publishedPosts = posts.filter((post) => post.status === "published");
  const categories = ["All", ...CATEGORIES];

  categoryList.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    const count = category === "All"
      ? publishedPosts.length
      : publishedPosts.filter((post) => post.category === category).length;
    button.className = `category-tab${category === activeCategory ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `<span>${category}</span><strong>${count}</strong>`;
    button.addEventListener("click", () => {
      activeCategory = category;
      render();
    });
    categoryList.append(button);
  });

  categoryInput.innerHTML = CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join("");
}

function renderPosts() {
  const visiblePosts = getVisiblePosts();
  postGrid.innerHTML = "";
  feedTitle.textContent = activeCategory === "All" ? "Latest Pieces" : activeCategory;
  activeCategoryLabel.textContent = activeCategory === "All" ? "All writing" : `${visiblePosts.length} pieces`;

  if (!visiblePosts.length) {
    postGrid.innerHTML = `<div class="empty-state">No published pieces yet.</div>`;
    return;
  }

  const template = document.querySelector("#postCardTemplate");
  visiblePosts.forEach((post) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".post-card");
    const button = node.querySelector(".card-button");
    const pill = node.querySelector(".category-pill");
    const date = node.querySelector(".date");
    const title = node.querySelector("h3");
    const copy = node.querySelector(".excerpt");
    const byline = node.querySelector(".byline");

    pill.textContent = post.category;
    pill.classList.add(slugCategory(post.category));
    date.textContent = formatDate(post.created_at);
    title.textContent = post.title;
    copy.textContent = excerpt(post.body);
    byline.textContent = `By ${post.author} · ${displayCredit(post)}`;
    button.addEventListener("click", () => openPost(post.id));
    postGrid.append(card);
  });
}

function getLibraryPosts() {
  if (isOwner()) return posts;
  if (!isSignedIn()) return [];
  return posts.filter((post) => ownsPost(post));
}

function renderLibrary() {
  if (!isSignedIn()) {
    libraryList.innerHTML = "";
    return;
  }

  const sorted = [...getLibraryPosts()].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  libraryList.innerHTML = "";

  if (!sorted.length) {
    libraryList.innerHTML = `<div class="empty-state">Your library is empty.</div>`;
    return;
  }

  sorted.forEach((post) => {
    const item = document.createElement("article");
    item.className = "library-item";
    const statusLabel = post.status === "pending" ? "Pending approval" : "Published";
    const approveButton = isOwner() && post.status === "pending" ? '<button type="button" data-action="approve">Approve</button>' : "";
    const editButton = canEditPost(post) ? '<button type="button" data-action="edit">Edit</button>' : "";
    const deleteButton = canDeletePost(post) ? '<button type="button" data-action="delete">Delete</button>' : "";

    item.innerHTML = `
      <div>
        <strong>${escapeHTML(post.title)}</strong>
        <span>${escapeHTML(post.author)} · ${escapeHTML(post.category)} · ${formatDate(post.created_at)}</span>
        <em class="status-badge ${post.status === "pending" ? "pending" : "published"}">${statusLabel}</em>
      </div>
      <div class="mini-actions">
        <button type="button" data-action="read">Read</button>
        ${editButton}
        ${approveButton}
        ${deleteButton}
      </div>
    `;

    item.querySelector('[data-action="read"]').addEventListener("click", () => openPost(post.id));
    item.querySelector('[data-action="edit"]')?.addEventListener("click", () => startEditingPost(post.id));
    item.querySelector('[data-action="approve"]')?.addEventListener("click", () => approvePost(post.id));
    item.querySelector('[data-action="delete"]')?.addEventListener("click", () => deletePost(post));
    libraryList.append(item);
  });
}

function openPost(id) {
  const post = posts.find((item) => item.id === id);
  if (!post || (post.status !== "published" && !isOwner() && !ownsPost(post))) return;

  readerArticle.innerHTML = `
    <p class="eyebrow">${escapeHTML(post.category)}</p>
    <h2>${escapeHTML(post.title)}</h2>
    <div class="reader-meta">
      <span>By ${escapeHTML(post.author)}</span>
      <span>${displayCredit(post)}</span>
      <span>${formatDate(post.created_at)}</span>
    </div>
    <div class="reader-body">${formatReaderBody(post.body)}</div>
  `;
  readerPanel.classList.remove("hidden");
  readerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearPostForm({ preserveSubstackNote = false } = {}) {
  editingPostId = null;
  postForm.reset();
  fileName.textContent = "Choose file";
  if (!preserveSubstackNote) substackNote.textContent = "";
  renderAccess();
}

function buildSubstackDraft(post) {
  return [
    post.title,
    "",
    post.body,
    "",
    `Originally submitted to Common Pages: ${SITE_URL}`
  ].join("\n");
}

async function copySubstackDraft(post) {
  if (!navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(buildSubstackDraft(post));
    return true;
  } catch {
    return false;
  }
}

async function offerSubstackHandoff(post) {
  if (!substackInput.checked) return;

  const copied = await copySubstackDraft(post);
  const status = copied
    ? "Copied a Substack-ready draft to your clipboard. Substack does not let this site create the draft for you, so open Substack and paste it into a new post."
    : "Saved to Common Pages. Substack does not let this site create the draft for you, so open Substack and copy your title and writing into a new post.";
  substackNote.textContent = status;

  const shouldOpen = window.confirm(`${status}\n\nOpen Substack now?`);
  if (shouldOpen) {
    window.open(SUBSTACK_PUBLISH_URL, "_blank", "noopener,noreferrer");
  }
}

function getPracticeItems() {
  const difficulty = practiceDifficulty.value;
  const topic = practiceTopic.value;
  let items = practiceData.spanishPrompts.filter((item) => item.modes.includes("retype"));
  if (practiceState.mode === "typing") items = practiceData.typingPassages;
  if (practiceState.mode === "spanish-translate") {
    items = practiceData.spanishPrompts.filter((item) => item.modes.includes("translate"));
  }
  if (practiceState.mode === "writing-sprint") items = practiceData.writingPrompts || [];

  return items.filter((item) => {
    return item.difficulty === difficulty && (topic === "all" || item.category === topic);
  });
}

function getPracticeTarget(item) {
  if (!item) return "";
  if (practiceState.mode === "typing") return item.text;
  if (practiceState.mode === "writing-sprint") return item.text;
  return item.spanish;
}

function practiceScope() {
  return `${practiceState.mode}:${practiceDifficulty.value}:${practiceTopic.value || "all"}`;
}

function getPracticeBestKey() {
  return `commonPagesPracticeBest:${practiceScope()}`;
}

function practiceScoreKey() {
  return `commonPagesPracticeScores:${practiceScope()}`;
}

function practiceHistoryKey() {
  return `commonPagesPracticeHistory:${account?.id || "guest"}:${practiceScope()}`;
}

function isLeaderboardMode() {
  return practiceState.mode !== "writing-sprint";
}

function loadPracticeBest() {
  try {
    return JSON.parse(localStorage.getItem(getPracticeBestKey()));
  } catch {
    return null;
  }
}

function savePracticeBest(result) {
  const previous = loadPracticeBest();
  const currentScore = practiceState.mode === "writing-sprint" ? result.wordCount : result.wpm;
  const previousScore = practiceState.mode === "writing-sprint" ? previous?.wordCount : previous?.wpm;
  if (previous && Number(previousScore || 0) >= Number(currentScore || 0)) return previous;
  localStorage.setItem(getPracticeBestKey(), JSON.stringify(result));
  return result;
}

function renderPracticeBest() {
  const best = loadPracticeBest();
  if (!best) {
    practiceBest.textContent = "Best score: none yet.";
    return;
  }

  if (practiceState.mode === "writing-sprint") {
    practiceBest.textContent = `Best sprint: ${best.wordCount || 0} words · ${best.wpm} WPM · ${best.time}s`;
    return;
  }

  practiceBest.textContent = `Best score: ${best.wpm} WPM · ${best.accuracy}% accuracy · ${best.time}s`;
}

function renderPracticeTopics() {
  const currentTopic = practiceTopic.value || "all";
  const difficulty = practiceDifficulty.value;
  let items = practiceData.spanishPrompts.filter((item) => item.modes.includes("retype"));
  if (practiceState.mode === "typing") items = practiceData.typingPassages;
  if (practiceState.mode === "spanish-translate") {
    items = practiceData.spanishPrompts.filter((item) => item.modes.includes("translate"));
  }
  if (practiceState.mode === "writing-sprint") items = practiceData.writingPrompts || [];
  const topics = [...new Set(items
    .filter((item) => item.difficulty === difficulty)
    .map((item) => item.category))]
    .sort((a, b) => a.localeCompare(b));

  practiceTopic.innerHTML = [
    '<option value="all">All topics</option>',
    ...topics.map((topic) => `<option value="${escapeHTML(topic)}">${escapeHTML(topic)}</option>`)
  ].join("");
  practiceTopic.value = topics.includes(currentTopic) ? currentTopic : "all";
}

function stopPracticeTimer() {
  if (!practiceState.timerId) return;
  clearInterval(practiceState.timerId);
  practiceState.timerId = null;
}

function getWritingSprintSeconds() {
  if (!practiceTimer || practiceTimer.value !== "custom") return Number(practiceTimer?.value || WRITING_SPRINT_SECONDS);
  const minutes = Number(practiceCustomTimer?.value || 1);
  return Math.max(60, Math.min(3600, minutes * 60));
}

function formatSprintLength(seconds = getWritingSprintSeconds()) {
  const minutes = Math.round(seconds / 60);
  return minutes === 1 ? "one-minute" : `${minutes}-minute`;
}

function renderPracticeTimerControls() {
  const isSprint = practiceState.mode === "writing-sprint";
  practiceTimerControl?.classList.toggle("hidden", !isSprint);
  practiceCustomTimerControl?.classList.toggle("hidden", !isSprint || practiceTimer?.value !== "custom");
}

function resetPracticeTimer() {
  stopPracticeTimer();
  practiceState.startedAt = null;
  practiceState.elapsed = 0;
  practiceState.finished = false;
  practiceState.lastResult = null;
}

function startPracticeTimer() {
  if (practiceState.startedAt || practiceState.finished) return;
  practiceState.startedAt = Date.now();
  practiceState.timerId = window.setInterval(renderPracticeProgress, 100);
}

function getPracticeElapsed() {
  if (!practiceState.startedAt) return practiceState.elapsed;
  if (practiceState.finished) return practiceState.elapsed;
  return (Date.now() - practiceState.startedAt) / 1000;
}

function getWritingSprintRemaining() {
  return Math.max(0, getWritingSprintSeconds() - getPracticeElapsed());
}

function measurePractice(input, target) {
  if (practiceState.mode === "writing-sprint") {
    const elapsed = Math.min(Math.max(getPracticeElapsed(), 0.01), getWritingSprintSeconds());
    const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
    return {
      typed: input.length,
      correct: input.length,
      mistakes: 0,
      firstMistake: -1,
      elapsed,
      wpm: Math.round(wordCount / (elapsed / 60)),
      accuracy: 100,
      wordCount,
      complete: getWritingSprintRemaining() <= 0
    };
  }

  if (practiceState.mode === "spanish-translate") {
    const elapsed = Math.max(getPracticeElapsed(), 0.01);
    const normalizedInput = normalizePracticeAnswer(input);
    const answers = (practiceState.item?.answers || []).map(normalizePracticeAnswer);
    const complete = Boolean(normalizedInput) && answers.includes(normalizedInput);
    const likelyMatch = !normalizedInput || answers.some((answer) => answer.startsWith(normalizedInput));

    return {
      typed: input.length,
      correct: likelyMatch ? input.length : 0,
      mistakes: likelyMatch ? 0 : 1,
      firstMistake: likelyMatch ? -1 : 0,
      elapsed,
      wpm: Math.round((input.length / 5) / (elapsed / 60)),
      accuracy: likelyMatch ? 100 : 0,
      complete
    };
  }

  const typed = input.length;
  let correct = 0;
  let mistakes = 0;
  let firstMistake = -1;

  for (let index = 0; index < typed; index += 1) {
    if (input[index] === target[index]) {
      correct += 1;
    } else {
      mistakes += 1;
      if (firstMistake === -1) firstMistake = index;
    }
  }

  const elapsed = Math.max(getPracticeElapsed(), 0.01);
  const wpm = Math.round((typed / 5) / (elapsed / 60));
  const accuracy = typed ? Math.max(0, Math.round((correct / typed) * 100)) : 100;

  return {
    typed,
    correct,
    mistakes,
    firstMistake,
    elapsed,
    wpm,
    accuracy,
    complete: input === target
  };
}

function normalizePracticeAnswer(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function archiveConfig() {
  return ARCHIVIST_MODES[archivistState.mode] || ARCHIVIST_MODES.normal;
}

function archiveItemsForMode() {
  const config = archiveConfig();
  return (practiceData.archivistItems || []).filter((item) => {
    return item.tier <= config.maxTier && config.tags.includes(item.tag);
  });
}

function normalizeArchiveTag(value) {
  return normalizePracticeAnswer(value).replace(/\s+/g, "");
}

function formatArchiveDescription(item, isLowest = false) {
  let description = escapeHTML(item.description);
  if (archivistState.lantern) {
    (ARCHIVIST_CLUES[item.tag] || []).forEach((clue) => {
      const pattern = new RegExp(`\\b(${escapeRegExp(escapeHTML(clue))})\\b`, "gi");
      description = description.replace(pattern, "<mark>$1</mark>");
    });
  }
  const hint = archivistState.hints && isLowest
    ? `<em class="archive-hint">Hint: ${escapeHTML(item.tag[0])}${".".repeat(Math.max(0, item.tag.length - 1))}</em>`
    : "";
  return `${description}${hint}`;
}

function renderArchivistTags() {
  const config = archiveConfig();
  const visibleTags = archivistState.indexCards || archivistState.mode === "calm";
  if (!visibleTags) {
    archivistTags.innerHTML = `<span class="locked-tags">Index Cards hidden. Earn the upgrade to reveal possible tags.</span>`;
    return;
  }

  archivistTags.innerHTML = config.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");
}

function renderArchivistStats() {
  archivistScore.textContent = String(archivistState.score);
  archivistSaved.textContent = String(archivistState.saved);
  archivistLost.textContent = `${archivistState.lost}/${archivistState.maxLost}`;
  archivistStreak.textContent = String(archivistState.streak);
  archivistTime.textContent = `${Math.max(0, Math.ceil(archivistState.timeLeft))}s`;
  archivistBellButton.disabled = !archivistState.running || archivistState.bellCharges <= 0 || archivistState.paused;
  renderArchivistTags();
}

function renderArchivistUpgrades() {
  if (!archivistState.upgrades.length) {
    archivistUpgrades.innerHTML = "<p>No upgrades yet. Save items to earn choices during the run.</p>";
    return;
  }

  archivistUpgrades.innerHTML = archivistState.upgrades.map((upgrade) => `
    <span>${escapeHTML(upgrade)}</span>
  `).join("");
}

function clearArchiveItems() {
  archivistState.items.forEach((item) => item.node?.remove());
  archivistState.items = [];
}

function resetArchivistRun({ keepMode = true } = {}) {
  if (archivistState.loopId) window.cancelAnimationFrame(archivistState.loopId);
  clearArchiveItems();
  archivistState = {
    running: false,
    paused: false,
    loopId: null,
    lastFrame: 0,
    lastSpawn: 0,
    nextId: 1,
    mode: keepMode ? archivistMode.value : "normal",
    items: [],
    seenIds: [],
    score: 0,
    saved: 0,
    lost: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    timeLeft: ARCHIVIST_MODES[keepMode ? archivistMode.value : "normal"].timeLimit,
    maxLost: ARCHIVIST_MODES[keepMode ? archivistMode.value : "normal"].maxLost,
    speedMultiplier: 1,
    indexCards: keepMode && archivistMode.value === "calm",
    lantern: false,
    hints: false,
    autoSaveCharges: 0,
    bellCharges: 0,
    upgrades: [],
    nextUpgradeAt: 4
  };
  archivistInput.value = "";
  archivistInput.disabled = true;
  archivistStartButton.textContent = "Start Run";
  archivistStartCard.classList.remove("hidden");
  archivistFeedback.textContent = "Choose a mode, then start a run.";
  archivistResult.textContent = "No run completed yet.";
  renderArchivistStats();
  renderArchivistUpgrades();
}

function chooseArchiveItem() {
  const items = archiveItemsForMode();
  const activeDescriptions = new Set(archivistState.items.map((item) => item.description));
  const freshItems = items.filter((item) => {
    return !activeDescriptions.has(item.description) && !archivistState.seenIds.includes(item.description);
  });
  const pool = freshItems.length ? freshItems : items.filter((item) => !activeDescriptions.has(item.description));
  const item = pool[Math.floor(Math.random() * pool.length)] || items[Math.floor(Math.random() * items.length)];
  if (!item) return null;
  archivistState.seenIds.push(item.description);
  if (archivistState.seenIds.length > 18) archivistState.seenIds.shift();
  return item;
}

function spawnArchiveItem() {
  if (archivistState.items.length >= archiveConfig().activeLimit) return;
  const item = chooseArchiveItem();
  if (!item) return;

  const node = document.createElement("article");
  node.className = "archive-item";
  node.dataset.id = String(archivistState.nextId);
  node.innerHTML = `
    <strong>${escapeHTML(item.theme)}</strong>
    <p>${formatArchiveDescription(item)}</p>
  `;
  archivistStage.append(node);

  archivistState.items.push({
    ...item,
    id: archivistState.nextId,
    y: -10,
    node
  });
  archivistState.nextId += 1;
}

function scoreArchiveItem(item, auto = false) {
  const stageHeight = Math.max(1, archivistStage.clientHeight || 380);
  const progress = Math.min(1, Math.max(0, item.y / stageHeight));
  const fastBonus = Math.round((1 - progress) * 65);
  const streakBonus = archivistState.streak * 8;
  const hardBonus = item.tier * 18;
  const autoPenalty = auto ? 35 : 0;
  return Math.max(20, Math.round((100 + fastBonus + streakBonus + hardBonus - autoPenalty) * archiveConfig().scoreMultiplier));
}

function removeArchiveItem(item) {
  item.node?.remove();
  archivistState.items = archivistState.items.filter((active) => active.id !== item.id);
}

function saveArchiveItem(item, { auto = false } = {}) {
  archivistState.streak += 1;
  archivistState.bestStreak = Math.max(archivistState.bestStreak, archivistState.streak);
  const points = scoreArchiveItem(item, auto);
  archivistState.score += points;
  archivistState.saved += 1;
  removeArchiveItem(item);
  archivistFeedback.textContent = `${auto ? "Apprentice saved" : "Saved"} ${item.tag}. +${points} points.`;
  if (archivistState.saved >= archivistState.nextUpgradeAt) offerArchivistUpgrade();
  renderArchivistStats();
}

function loseArchiveItem(item) {
  if (archivistState.autoSaveCharges > 0) {
    archivistState.autoSaveCharges -= 1;
    saveArchiveItem(item, { auto: true });
    return;
  }

  archivistState.lost += 1;
  archivistState.streak = 0;
  removeArchiveItem(item);
  archivistFeedback.textContent = `Lost item. It belonged on the ${item.tag} shelf.`;
  renderArchivistStats();
  if (archivistState.lost >= archivistState.maxLost) finishArchivistRun();
}

function renderArchiveItems() {
  const lowest = [...archivistState.items].sort((a, b) => b.y - a.y)[0];
  archivistState.items.forEach((item) => {
    item.node.style.transform = `translateY(${item.y}px)`;
    item.node.innerHTML = `
      <strong>${escapeHTML(item.theme)}</strong>
      <p>${formatArchiveDescription(item, lowest?.id === item.id)}</p>
    `;
  });
}

function archivistLoop(timestamp) {
  if (!archivistState.running) return;

  if (!archivistState.lastFrame) archivistState.lastFrame = timestamp;
  const delta = Math.min(0.08, (timestamp - archivistState.lastFrame) / 1000);
  archivistState.lastFrame = timestamp;

  if (archivistState.paused) {
    archivistState.loopId = window.requestAnimationFrame(archivistLoop);
    return;
  }

  archivistState.timeLeft -= delta;
  if (timestamp - archivistState.lastSpawn >= archiveConfig().spawnEvery) {
    spawnArchiveItem();
    archivistState.lastSpawn = timestamp;
  }

  const bottom = (archivistStage.clientHeight || 380) - 34;
  archivistState.items.forEach((item) => {
    item.y += archiveConfig().speed * archivistState.speedMultiplier * delta;
  });

  [...archivistState.items].forEach((item) => {
    if (item.y >= bottom) loseArchiveItem(item);
  });
  if (!archivistState.running) return;

  renderArchiveItems();
  renderArchivistStats();

  if (archivistState.timeLeft <= 0) {
    finishArchivistRun();
    return;
  }

  archivistState.loopId = window.requestAnimationFrame(archivistLoop);
}

function startArchivistRun() {
  resetArchivistRun();
  archivistState.running = true;
  archivistState.paused = false;
  const now = window.performance?.now ? window.performance.now() : 0;
  archivistState.lastFrame = now;
  archivistState.lastSpawn = now;
  archivistStartButton.textContent = "Run Active";
  archivistStartCard.classList.add("hidden");
  archivistInput.disabled = false;
  archivistInput.focus();
  archivistFeedback.textContent = "Archive doors open. Type a tag, then press Enter.";
  spawnArchiveItem();
  renderArchivistStats();
  archivistState.loopId = window.requestAnimationFrame(archivistLoop);
}

function submitArchiveTag() {
  if (!archivistState.running || archivistState.paused) return;
  const value = normalizeArchiveTag(archivistInput.value);
  if (!value) return;

  const matches = archivistState.items.filter((item) => normalizeArchiveTag(item.tag) === value);
  if (matches.length) {
    const target = matches.sort((a, b) => b.y - a.y)[0];
    archivistInput.value = "";
    saveArchiveItem(target);
    return;
  }

  archivistState.wrong += 1;
  archivistState.streak = 0;
  archivistState.timeLeft = Math.max(0, archivistState.timeLeft - 4);
  archivistFeedback.textContent = "Wrong shelf. Four seconds lost; keep reading.";
  archivistInput.value = "";
  renderArchivistStats();
}

function availableArchivistUpgrades() {
  const used = new Set(archivistState.upgrades);
  return ARCHIVIST_UPGRADES.filter((upgrade) => {
    if (upgrade.id === "index-cards" && archivistState.indexCards) return false;
    if (upgrade.id === "better-lantern" && archivistState.lantern) return false;
    if (upgrade.id === "magnifying-glass" && archivistState.hints) return false;
    return !used.has(upgrade.name) || ["Extra Shelf", "Apprentice Helper", "Archive Bell", "Slower Scroll"].includes(upgrade.name);
  });
}

function offerArchivistUpgrade() {
  archivistState.paused = true;
  archivistState.nextUpgradeAt += 4;
  const choices = availableArchivistUpgrades()
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  archivistFeedback.textContent = "Upgrade ready. Choose one to continue the run.";
  archivistUpgrades.innerHTML = choices.map((upgrade) => `
    <button type="button" data-upgrade="${escapeHTML(upgrade.id)}">
      <strong>${escapeHTML(upgrade.name)}</strong>
      <span>${escapeHTML(upgrade.text)}</span>
    </button>
  `).join("");

  archivistUpgrades.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => {
      const upgrade = ARCHIVIST_UPGRADES.find((item) => item.id === button.dataset.upgrade);
      if (!upgrade) return;
      upgrade.apply();
      archivistState.upgrades.push(upgrade.name);
      archivistState.paused = false;
      archivistFeedback.textContent = `${upgrade.name} added. Keep shelving.`;
      renderArchivistUpgrades();
      renderArchivistStats();
      archivistInput.focus();
    });
  });
}

function archiveRank(score) {
  if (score >= 5200) return "Guardian of the Archive";
  if (score >= 4000) return "Master Archivist";
  if (score >= 2800) return "Senior Cataloger";
  if (score >= 1800) return "Keeper of Shelves";
  if (score >= 900) return "Junior Archivist";
  return "New Assistant";
}

function finishArchivistRun() {
  if (!archivistState.running) return;
  archivistState.running = false;
  archivistState.paused = false;
  if (archivistState.loopId) window.cancelAnimationFrame(archivistState.loopId);
  archivistState.loopId = null;
  clearArchiveItems();
  archivistInput.disabled = true;
  archivistStartButton.textContent = "Start Run";
  archivistStartCard.classList.remove("hidden");

  const attempts = Math.max(1, archivistState.saved + archivistState.lost + archivistState.wrong);
  const accuracy = Math.round((archivistState.saved / attempts) * 100);
  const noLostBonus = archivistState.lost === 0 && archivistState.saved > 0 ? Math.round(350 * archiveConfig().scoreMultiplier) : 0;
  archivistState.score += noLostBonus;
  const rank = archiveRank(archivistState.score);
  const bestKey = `commonPagesArchivistBest:${archivistState.mode}`;
  const previousBest = Number(localStorage.getItem(bestKey) || 0);
  if (archivistState.score > previousBest) localStorage.setItem(bestKey, String(archivistState.score));

  archivistResult.innerHTML = `
    <strong>${escapeHTML(rank)}</strong>
    <span>Items saved: ${archivistState.saved}</span>
    <span>Items lost: ${archivistState.lost}</span>
    <span>Accuracy: ${accuracy}%</span>
    <span>Highest streak: ${archivistState.bestStreak}</span>
    <span>Final score: ${archivistState.score}${noLostBonus ? `, including ${noLostBonus} no-lost bonus` : ""}</span>
    <span>${archivistState.score > previousBest ? "New best run for this mode." : `Best for this mode: ${previousBest}`}</span>
  `;
  archivistFeedback.textContent = "Run complete. Start another run whenever you are ready.";
  renderArchivistStats();
}

function renderArchivistSetup() {
  practiceLayout.classList.add("hidden");
  practiceSelects.classList.add("hidden");
  archivistGame.classList.remove("hidden");
  resetArchivistRun();
}

function closeArchivistGame() {
  if (archivistState.loopId) window.cancelAnimationFrame(archivistState.loopId);
  archivistState.running = false;
  clearArchiveItems();
}

function defaultTycoonState() {
  return {
    views: 0,
    subscribers: 0,
    revenue: 60,
    reputation: 0,
    energy: 5,
    maxEnergy: 5,
    assignments: 0,
    upgrades: [],
    log: ["Common Pages Micro-Fiction opens with one desk, one blank page, and a dangerous amount of optimism."],
    challenge: null,
    startedAt: null,
    elapsed: 0
  };
}

function loadTycoonState() {
  if (tycoonState) return tycoonState;
  try {
    const saved = JSON.parse(localStorage.getItem(TYCOON_SAVE_KEY));
    tycoonState = saved ? { ...defaultTycoonState(), ...saved } : defaultTycoonState();
  } catch {
    tycoonState = defaultTycoonState();
  }
  syncTycoonEnergyCap();
  return tycoonState;
}

function saveTycoonState() {
  if (!tycoonState) return;
  localStorage.setItem(TYCOON_SAVE_KEY, JSON.stringify({
    ...tycoonState,
    startedAt: null
  }));
}

function hasTycoonUpgrade(id) {
  return Boolean(tycoonState?.upgrades?.includes(id));
}

function syncTycoonEnergyCap() {
  if (!tycoonState) return;
  let maxEnergy = 5;
  if (hasTycoonUpgrade("coffee-machine")) maxEnergy += 2;
  if (hasTycoonUpgrade("editorial-calendar")) maxEnergy += 1;
  tycoonState.maxEnergy = maxEnergy;
  tycoonState.energy = Math.min(tycoonState.energy, maxEnergy);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value)));
}

function formatMoney(value) {
  return `$${formatNumber(value)}`;
}

function microFictionData() {
  return practiceData.microFiction || { genres: [], tropes: [], audiences: [], wordSets: [], specialEvents: [] };
}

function unlockedGenres() {
  const data = microFictionData();
  const genres = data.genres.filter((genre) => {
    if ((genre.unlockAt || 0) > tycoonState.reputation) return false;
    if (genre.requiresUpgrade && !hasTycoonUpgrade(genre.requiresUpgrade)) return false;
    return true;
  });
  return genres.length ? genres : data.genres.slice(0, 6);
}

function weightedChoice(items, weightForItem) {
  const weighted = items.map((item) => ({ item, weight: Math.max(0.1, weightForItem(item)) }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1]?.item || items[0];
}

function chooseTycoonGenre() {
  return weightedChoice(unlockedGenres(), (genre) => {
    if (genre.rarity === "rare") return hasTycoonUpgrade("archive-room") ? 2.2 : 1.1;
    if (genre.rarity === "uncommon") return 3;
    return 6;
  });
}

function chooseTycoonEvent() {
  const data = microFictionData();
  const available = data.specialEvents.filter((event) => (event.unlockAt || 0) <= tycoonState.assignments);
  const eventChance = 0.13 + (hasTycoonUpgrade("editorial-calendar") ? 0.16 : 0);
  if (!available.length || Math.random() > eventChance) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function createTycoonChallenge() {
  const data = microFictionData();
  const genre = chooseTycoonGenre();
  const trope = data.tropes[Math.floor(Math.random() * data.tropes.length)] || "A surprising deadline";
  const audience = data.audiences[Math.floor(Math.random() * data.audiences.length)] || "web-novel fans";
  const words = data.wordSets[Math.floor(Math.random() * data.wordSets.length)] || ["coffee", "elevator", "neon"];
  const event = chooseTycoonEvent();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    genre: genre?.name || "Fantasy",
    rarity: genre?.rarity || "common",
    trope,
    audience,
    words,
    event,
    targetWords: 100
  };
}

function renderTycoonResources() {
  syncTycoonEnergyCap();
  tycoonViews.textContent = formatNumber(tycoonState.views);
  tycoonSubscribers.textContent = formatNumber(tycoonState.subscribers);
  tycoonRevenue.textContent = formatMoney(tycoonState.revenue);
  tycoonReputation.textContent = formatNumber(tycoonState.reputation);
  tycoonEnergy.textContent = `${tycoonState.energy}/${tycoonState.maxEnergy}`;
}

function renderTycoonAssignment() {
  const challenge = tycoonState.challenge;
  if (!challenge) {
    tycoonAssignment.innerHTML = `
      <p class="eyebrow">Assignment Board</p>
      <h3>No assignment yet.</h3>
      <p>Start a new assignment to receive a genre, trope, audience, and three required words.</p>
    `;
    return;
  }

  tycoonAssignment.innerHTML = `
    <p class="eyebrow">${challenge.event ? escapeHTML(challenge.event.name) : "Assignment Board"}</p>
    <h3>${escapeHTML(challenge.genre)} for ${escapeHTML(challenge.audience)}</h3>
    <div class="assignment-grid">
      <span><strong>Trope</strong>${escapeHTML(challenge.trope)}</span>
      <span><strong>Target</strong>${challenge.targetWords} words</span>
      <span><strong>Required</strong>${challenge.words.map(escapeHTML).join(", ")}</span>
      <span><strong>Rarity</strong>${escapeHTML(challenge.rarity)}</span>
    </div>
    ${challenge.event ? `<p class="event-note">${escapeHTML(challenge.event.text)}</p>` : ""}
  `;
}

function tycoonWordList(text) {
  return text.toLowerCase().match(/[a-z0-9'-]+/g) || [];
}

function tycoonWordCountFor(text) {
  return tycoonWordList(text).length;
}

function requiredWordsUsed(text, words = tycoonState.challenge?.words || []) {
  const normalized = ` ${tycoonWordList(text).join(" ")} `;
  return words.filter((word) => normalized.includes(` ${word.toLowerCase()} `));
}

function formatElapsed(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const remainder = String(safe % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function currentTycoonElapsed() {
  if (!tycoonState.startedAt) return tycoonState.elapsed || 0;
  return Math.floor((Date.now() - tycoonState.startedAt) / 1000);
}

function updateTycoonLiveStats() {
  const text = tycoonDraft.value;
  const words = tycoonWordCountFor(text);
  const used = requiredWordsUsed(text);
  tycoonWordCount.textContent = `${words}/100 words`;
  tycoonKeywordCount.textContent = `${used.length}/3 required words`;
  tycoonTimer.textContent = formatElapsed(currentTycoonElapsed());
}

function startTycoonTimer() {
  if (!tycoonState.challenge || tycoonState.startedAt) return;
  tycoonState.startedAt = Date.now();
  window.clearInterval(tycoonTimerId);
  tycoonTimerId = window.setInterval(updateTycoonLiveStats, 1000);
}

function stopTycoonTimer() {
  if (tycoonTimerId) window.clearInterval(tycoonTimerId);
  tycoonTimerId = null;
  if (tycoonState?.startedAt) {
    tycoonState.elapsed = currentTycoonElapsed();
    tycoonState.startedAt = null;
  }
}

function renderTycoonShop() {
  tycoonShop.innerHTML = TYCOON_UPGRADES.map((upgrade) => {
    const owned = hasTycoonUpgrade(upgrade.id);
    const locked = upgrade.requires && !hasTycoonUpgrade(upgrade.requires);
    const affordable = tycoonState.revenue >= upgrade.cost;
    return `
      <button type="button" data-upgrade="${escapeHTML(upgrade.id)}" ${owned || locked || !affordable ? "disabled" : ""}>
        <strong>${escapeHTML(upgrade.name)} <em>${owned ? "Owned" : formatMoney(upgrade.cost)}</em></strong>
        <span>${escapeHTML(locked ? "Requires previous desk upgrade." : upgrade.text)}</span>
      </button>
    `;
  }).join("");

  tycoonShop.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => buyTycoonUpgrade(button.dataset.upgrade));
  });
}

function renderTycoonLog() {
  tycoonLog.innerHTML = tycoonState.log.slice(0, 8).map((entry) => `<p>${escapeHTML(entry)}</p>`).join("");
}

function renderTycoon() {
  renderTycoonResources();
  renderTycoonAssignment();
  renderTycoonShop();
  renderTycoonLog();
  updateTycoonLiveStats();
}

function newTycoonAssignment() {
  loadTycoonState();
  stopTycoonTimer();
  if (tycoonState.energy <= 0) {
    tycoonFeedback.textContent = "Creative energy is empty. Buy a Coffee Machine or publish stronger pieces to recover faster.";
    return;
  }

  tycoonState.challenge = createTycoonChallenge();
  tycoonState.elapsed = 0;
  tycoonDraft.value = "";
  tycoonResult.classList.add("hidden");
  tycoonResult.innerHTML = "";
  tycoonFeedback.textContent = "Assignment ready. Write around 100 words and include all three required words.";
  saveTycoonState();
  renderTycoon();
  tycoonDraft.focus();
}

function tycoonQualityGate(text, wordCount) {
  if (wordCount < 60) return "Write at least 60 words before publishing this piece.";
  const words = tycoonWordList(text);
  const unique = new Set(words).size;
  if (words.length >= 25 && unique / words.length < 0.32) {
    return "This draft repeats too much. Add more real sentences before publishing.";
  }
  if (/(^|\s)(\w+)(\s+\2){4,}(\s|$)/i.test(text)) {
    return "This looks like repeated filler. The tycoon rewards real writing, not padding.";
  }
  return "";
}

function tycoonUpgradeMultiplier(kind) {
  let multiplier = 1;
  if (kind === "views") {
    if (hasTycoonUpgrade("cover-designer")) multiplier += 0.3;
    if (hasTycoonUpgrade("vintage-oak-desk")) multiplier += 0.12;
    if (hasTycoonUpgrade("legendary-author-desk")) multiplier += 0.25;
  }
  if (kind === "subscribers") {
    if (hasTycoonUpgrade("newsletter-system")) multiplier += 0.45;
    if (hasTycoonUpgrade("editors-desk")) multiplier += 0.18;
  }
  if (kind === "revenue") {
    if (hasTycoonUpgrade("serial-analytics")) multiplier += 0.4;
    if (hasTycoonUpgrade("legendary-author-desk")) multiplier += 0.25;
  }
  return multiplier;
}

function suggestTycoonUpgrade() {
  const available = TYCOON_UPGRADES.find((upgrade) => {
    if (hasTycoonUpgrade(upgrade.id)) return false;
    if (upgrade.requires && !hasTycoonUpgrade(upgrade.requires)) return false;
    return tycoonState.revenue >= upgrade.cost;
  });
  if (available) return `Upgrade suggestion: buy ${available.name}.`;
  const next = TYCOON_UPGRADES.find((upgrade) => !hasTycoonUpgrade(upgrade.id));
  return next ? `Upgrade suggestion: save for ${next.name}.` : "Upgrade suggestion: every shelf is humming.";
}

function publishTycoonStory() {
  loadTycoonState();
  if (!tycoonState.challenge) {
    tycoonFeedback.textContent = "Start an assignment first.";
    return;
  }

  const text = tycoonDraft.value.trim();
  const wordCount = tycoonWordCountFor(text);
  const qualityIssue = tycoonQualityGate(text, wordCount);
  if (qualityIssue) {
    tycoonFeedback.textContent = qualityIssue;
    return;
  }

  stopTycoonTimer();
  const challenge = tycoonState.challenge;
  const used = requiredWordsUsed(text, challenge.words);
  const missing = challenge.words.filter((word) => !used.includes(word));
  const elapsed = Math.max(1, tycoonState.elapsed || currentTycoonElapsed());
  const wordScore = Math.max(0, Math.round(100 - Math.abs(wordCount - 100) * 2));
  const keywordScore = Math.round((used.length / challenge.words.length) * 100);
  const speedScore = Math.max(0, Math.round(100 - Math.max(0, elapsed - 120) / 4));
  const words = tycoonWordList(text);
  const varietyScore = Math.min(100, Math.round((new Set(words).size / Math.max(1, words.length)) * 165));
  const score = Math.round(wordScore * 0.34 + keywordScore * 0.28 + speedScore * 0.14 + varietyScore * 0.16 + 8);
  const eventMultiplier = challenge.event?.multiplier || 1;
  const rarityBoost = challenge.rarity === "rare" ? 1.22 : challenge.rarity === "uncommon" ? 1.1 : 1;
  const viewsEarned = Math.round((140 + score * 12 + tycoonState.reputation * 7 + tycoonState.assignments * 18) * eventMultiplier * rarityBoost * tycoonUpgradeMultiplier("views"));
  const subscribersGained = Math.max(0, Math.round((viewsEarned / 260 + used.length + (score > 85 ? 4 : 0)) * tycoonUpgradeMultiplier("subscribers")));
  const revenueEarned = Math.max(1, Math.round((viewsEarned * 0.017 + score / 7) * tycoonUpgradeMultiplier("revenue")));
  let reputationGained = Math.max(1, Math.round(score / 24));
  if (hasTycoonUpgrade("organized-desk")) reputationGained += 1;
  if (hasTycoonUpgrade("editors-desk")) reputationGained += 1;

  tycoonState.views += viewsEarned;
  tycoonState.subscribers += subscribersGained;
  tycoonState.revenue += revenueEarned;
  tycoonState.reputation += reputationGained;
  tycoonState.assignments += 1;
  tycoonState.energy = Math.max(0, tycoonState.energy - 1);
  if (hasTycoonUpgrade("coffee-machine") && score >= 82) {
    tycoonState.energy = Math.min(tycoonState.maxEnergy, tycoonState.energy + 1);
  }
  tycoonState.log.unshift(`${challenge.genre}: ${formatNumber(viewsEarned)} views, ${formatMoney(revenueEarned)}, +${subscribersGained} subscribers.`);
  tycoonState.log = tycoonState.log.slice(0, 10);
  tycoonState.challenge = null;
  tycoonState.elapsed = 0;

  tycoonResult.classList.remove("hidden");
  tycoonResult.innerHTML = `
    <h3>Your Story Went Live!</h3>
    <div class="result-grid">
      <span><strong>Views earned</strong>${formatNumber(viewsEarned)}</span>
      <span><strong>Revenue earned</strong>${formatMoney(revenueEarned)}</span>
      <span><strong>Subscribers gained</strong>+${subscribersGained}</span>
      <span><strong>Reputation change</strong>+${reputationGained}</span>
      <span><strong>Word count</strong>${wordCount}/100</span>
      <span><strong>Required words</strong>${used.length}/${challenge.words.length}${missing.length ? `, missing ${missing.map(escapeHTML).join(", ")}` : ""}</span>
      <span><strong>Time taken</strong>${formatElapsed(elapsed)}</span>
      <span><strong>Constraint score</strong>${score}/100</span>
    </div>
    <p>${escapeHTML(suggestTycoonUpgrade())}</p>
  `;
  tycoonFeedback.textContent = "Published. Start another assignment when the platform needs a new spark.";
  saveTycoonState();
  renderTycoon();
}

function buyTycoonUpgrade(id) {
  loadTycoonState();
  const upgrade = TYCOON_UPGRADES.find((item) => item.id === id);
  if (!upgrade || hasTycoonUpgrade(id)) return;
  if (upgrade.requires && !hasTycoonUpgrade(upgrade.requires)) return;
  if (tycoonState.revenue < upgrade.cost) return;

  tycoonState.revenue -= upgrade.cost;
  tycoonState.upgrades.push(id);
  if (id === "coffee-machine") tycoonState.energy = Math.min(7, tycoonState.energy + 2);
  syncTycoonEnergyCap();
  tycoonState.log.unshift(`${upgrade.name} purchased.`);
  saveTycoonState();
  renderTycoon();
}

function moveTycoonDraftToPublish() {
  if (!tycoonDraft.value.trim()) {
    tycoonFeedback.textContent = "Write a draft first, then move it into Common Pages.";
    return;
  }
  const challenge = tycoonState?.challenge;
  titleInput.value = challenge ? `${challenge.genre}: ${challenge.trope}` : "Micro-Fiction Draft";
  authorInput.value = account?.user_metadata?.display_name || account?.email || "";
  categoryInput.value = "Fiction";
  bodyInput.value = tycoonDraft.value.trim();
  document.querySelector("#submit").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetTycoonProgress() {
  if (!window.confirm("Reset Micro-Fiction Tycoon progress on this browser?")) return;
  window.clearInterval(tycoonTimerId);
  localStorage.removeItem(TYCOON_SAVE_KEY);
  tycoonState = defaultTycoonState();
  tycoonDraft.value = "";
  tycoonResult.classList.add("hidden");
  tycoonFeedback.textContent = "Tycoon reset. The platform is tiny again.";
  saveTycoonState();
  renderTycoon();
}

function renderTycoonSetup() {
  loadTycoonState();
  practiceLayout.classList.add("hidden");
  practiceSelects.classList.add("hidden");
  archivistGame.classList.add("hidden");
  tycoonGame.classList.remove("hidden");
  renderTycoon();
}

function closeTycoonGame() {
  stopTycoonTimer();
  tycoonGame?.classList.add("hidden");
}

function renderCharacterTrack() {
  if (practiceState.mode === "spanish-translate" || practiceState.mode === "writing-sprint") {
    characterTrack.innerHTML = "";
    return;
  }

  const input = practiceInput.value;
  const target = practiceState.target;
  characterTrack.innerHTML = "";

  [...target].forEach((char, index) => {
    const span = document.createElement("span");
    const typed = input[index];
    span.textContent = char === " " ? " " : char;
    if (typed == null) span.className = "pending";
    else span.className = typed === char ? "correct" : "incorrect";
    characterTrack.append(span);
  });
}

function scoreValue(result) {
  return result.mode === "writing-sprint" ? result.wordCount : result.wpm;
}

function compareScores(a, b) {
  const primary = scoreValue(b) - scoreValue(a);
  if (primary) return primary;
  const accuracy = (b.accuracy || 0) - (a.accuracy || 0);
  if (accuracy) return accuracy;
  return (a.elapsed || 9999) - (b.elapsed || 9999);
}

function loadJSONList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveJSONList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function normalizeInitials(value) {
  return value.replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase();
}

function askForInitials() {
  const fallback = account?.user_metadata?.display_name || account?.email || "";
  const suggested = normalizeInitials(fallback.split(/\s+/).map((part) => part[0]).join("")) || "YOU";
  const entered = window.prompt("Add your initials for the leaderboard:", suggested);
  return normalizeInitials(entered || suggested) || "YOU";
}

function formatPracticeScore(score) {
  return `${score.wpm || 0} WPM · ${score.accuracy || 0}% · ${score.mistakes || 0} mistakes`;
}

function localLeaderboard() {
  return loadJSONList(practiceScoreKey()).sort(compareScores).slice(0, 10);
}

function saveLocalPracticeScore(score) {
  const scores = [...localLeaderboard(), score].sort(compareScores).slice(0, 10);
  saveJSONList(practiceScoreKey(), scores);
  const history = [...loadJSONList(practiceHistoryKey()), score].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 50);
  saveJSONList(practiceHistoryKey(), history);
  return { scores, history };
}

function renderPracticeLeaderboard(scores = localLeaderboard()) {
  if (!practiceLeaderboard) return;
  if (!isLeaderboardMode()) {
    practiceLeaderboard.classList.add("hidden");
    practiceLeaderboard.innerHTML = "";
    return;
  }

  practiceLeaderboard.classList.remove("hidden");
  const rows = scores.slice(0, 10).map((score, index) => `
    <li>
      <span>${index + 1}</span>
      <strong>${escapeHTML(score.initials || "YOU")}</strong>
      <em>${escapeHTML(formatPracticeScore(score))}</em>
    </li>
  `).join("");

  practiceLeaderboard.innerHTML = `
    <h4>Leaderboard</h4>
    ${rows ? `<ol>${rows}</ol>` : "<p>No scores yet. Finish a round to post the first one.</p>"}
  `;
}

function renderPracticeComparison(score, scores, history) {
  const sortedScores = scores.sort(compareScores);
  const leaderboardRank = sortedScores.findIndex((item) => item.id === score.id) + 1;
  const previousBest = history.filter((item) => item.id !== score.id).sort(compareScores)[0];
  let personalLine = "This is your first saved try for this activity.";

  if (previousBest) {
    const difference = scoreValue(score) - scoreValue(previousBest);
    if (difference > 0) personalLine = `New personal best, up ${difference} from your previous best.`;
    else if (difference === 0) personalLine = "You matched your previous best.";
    else personalLine = `${Math.abs(difference)} behind your previous best.`;
  }

  practiceResults.classList.remove("hidden");
  practiceResults.innerHTML = `
    <strong>Round saved.</strong>
    <span>${leaderboardRank ? `You are #${leaderboardRank} on this top ten.` : "You are outside the current top ten."}</span>
    <span>${escapeHTML(personalLine)}</span>
  `;
  practiceLeaderboard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function completePracticeRound(result) {
  practiceState.finished = true;
  practiceState.elapsed = result.elapsed;
  practiceState.lastResult = result;
  stopPracticeTimer();
  practiceInput.disabled = true;

  const saved = savePracticeBest({
    wpm: result.wpm,
    accuracy: result.accuracy,
    mistakes: result.mistakes,
    wordCount: result.wordCount || 0,
    time: result.elapsed.toFixed(1)
  });

  if (practiceState.mode === "writing-sprint") {
    const body = practiceInput.value.trim();
    practiceFeedback.textContent = `Complete: ${result.wordCount || 0} words, ${result.wpm} WPM, ${result.elapsed.toFixed(1)} seconds.`;
    practiceBest.textContent = `Best sprint: ${saved.wordCount || 0} words · ${saved.wpm} WPM · ${saved.time}s`;
    practiceResults.classList.remove("hidden");
    practiceResults.innerHTML = `
      <strong>Writing sprint complete.</strong>
      <span>${result.wordCount || 0} words in ${formatSprintLength(getWritingSprintSeconds())} sprint.</span>
      <span>No leaderboard for writing sprints. This is a draft you can revise or publish.</span>
    `;
    if (body && window.confirm("Would you like to move this writing sprint into the Publish form?")) {
      titleInput.value = `Writing Sprint: ${practiceState.target.slice(0, 60)}`;
      authorInput.value = account?.user_metadata?.display_name || account?.email || "";
      categoryInput.value = "Notes";
      bodyInput.value = body;
      document.querySelector("#submit").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  const score = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    mode: practiceState.mode,
    difficulty: practiceDifficulty.value,
    topic: practiceTopic.value || "all",
    initials: askForInitials(),
    wpm: result.wpm,
    accuracy: result.accuracy,
    mistakes: result.mistakes,
    elapsed: Number(result.elapsed.toFixed(1)),
    wordCount: result.wordCount || 0,
    createdAt: new Date().toISOString()
  };
  const { scores, history } = saveLocalPracticeScore(score);
  renderPracticeLeaderboard(scores);
  renderPracticeComparison(score, scores, history);

  practiceFeedback.textContent = `Complete: ${result.wpm} WPM, ${result.accuracy}% accuracy, ${result.mistakes} mistakes, ${result.elapsed.toFixed(1)} seconds.`;
  practiceBest.textContent = `Best score: ${saved.wpm} WPM · ${saved.accuracy}% accuracy · ${saved.time}s`;
}

function renderPracticeProgress() {
  if (!practiceState.target) {
    practiceTime.textContent = practiceState.mode === "writing-sprint" ? `${getWritingSprintSeconds().toFixed(1)}s` : "0.0s";
    practiceWpm.textContent = "0";
    practiceAccuracy.textContent = practiceState.mode === "writing-sprint" ? "Sprint" : "100%";
    practiceMistakes.textContent = "0";
    return;
  }

  const result = measurePractice(practiceInput.value, practiceState.target);
  practiceTime.textContent = practiceState.mode === "writing-sprint" ? `${getWritingSprintRemaining().toFixed(1)}s` : `${result.elapsed.toFixed(1)}s`;
  practiceWpm.textContent = String(result.wpm);
  practiceAccuracy.textContent = practiceState.mode === "writing-sprint" ? "Sprint" : `${result.accuracy}%`;
  practiceMistakes.textContent = practiceState.mode === "writing-sprint" ? String(result.wordCount || 0) : String(result.mistakes);
  renderCharacterTrack();

  if (result.complete && !practiceState.finished) {
    completePracticeRound(result);
    return;
  }

  if (!result.typed) {
    practiceFeedback.textContent = practiceState.mode === "writing-sprint" ? `Start the ${formatSprintLength()} timer, then write until time runs out.` : "Start typing when you are ready.";
  } else if (practiceState.mode === "writing-sprint") {
    practiceFeedback.textContent = `${result.wordCount || 0} words so far. The sprint saves when the timer reaches zero.`;
  } else if (practiceState.mode === "spanish-translate" && result.firstMistake === -1) {
    practiceFeedback.textContent = "Keep translating. The answer is on track.";
  } else if (practiceState.mode === "spanish-translate") {
    practiceFeedback.textContent = "That translation is not matching yet. Try another wording.";
  } else if (result.firstMistake === -1) {
    practiceFeedback.textContent = "So far, every typed character matches.";
  } else {
    practiceFeedback.textContent = `Check character ${result.firstMistake + 1}; something differs from the prompt.`;
  }
}

function choosePracticeItem() {
  const items = getPracticeItems();
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function setPracticeItem(item = choosePracticeItem()) {
  resetPracticeTimer();
  practiceState.item = item;
  practiceState.target = getPracticeTarget(item);
  practiceInput.value = "";
  practiceResults.classList.add("hidden");
  practiceResults.innerHTML = "";

  const copy = practiceModeCopy[practiceState.mode];
  practiceModeLabel.textContent = copy.label;
  practiceTitle.textContent = copy.title;
  practiceInputLabel.textContent = copy.inputLabel;
  practiceFinishButton.classList.toggle("hidden", practiceState.mode !== "writing-sprint");
  practiceLeaderboard.classList.toggle("hidden", !isLeaderboardMode());
  renderPracticeTimerControls();
  if (practiceMetricLabels.length >= 4) {
    practiceMetricLabels[0].textContent = practiceState.mode === "writing-sprint" ? "Time Left" : "Time";
    practiceMetricLabels[1].textContent = "WPM";
    practiceMetricLabels[2].textContent = practiceState.mode === "writing-sprint" ? "Mode" : "Accuracy";
    practiceMetricLabels[3].textContent = practiceState.mode === "writing-sprint" ? "Words" : "Mistakes";
  }

  if (!item) {
    practicePrompt.textContent = "No prompts are available for this combination yet.";
    practiceInput.disabled = true;
    practiceFeedback.textContent = "Choose another difficulty or topic.";
    characterTrack.innerHTML = "";
    renderPracticeBest();
    renderPracticeProgress();
    renderPracticeLeaderboard();
    return;
  }

  practicePrompt.textContent = practiceState.target;
  practiceInput.disabled = false;
  practiceFeedback.textContent = practiceState.mode === "writing-sprint" ? `Start the ${formatSprintLength()} timer, then write until time runs out.` : "Start typing when you are ready.";
  renderPracticeBest();
  renderPracticeProgress();
  renderPracticeLeaderboard();
}

function openPracticeMode(mode) {
  practiceState.mode = mode;
  closeArchivistGame();
  closeTycoonGame();
  if (mode === "archivist") {
    practiceMenu.classList.add("hidden");
    practiceWorkbench.classList.remove("hidden");
    renderArchivistSetup();
    practiceWorkbench.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (mode === "tycoon") {
    practiceMenu.classList.add("hidden");
    practiceWorkbench.classList.remove("hidden");
    renderTycoonSetup();
    practiceWorkbench.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  practiceLayout.classList.remove("hidden");
  practiceSelects.classList.remove("hidden");
  archivistGame.classList.add("hidden");
  tycoonGame.classList.add("hidden");
  renderPracticeTopics();
  setPracticeItem();
  practiceMenu.classList.add("hidden");
  practiceWorkbench.classList.remove("hidden");
  practiceWorkbench.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closePracticeMode() {
  closeArchivistGame();
  closeTycoonGame();
  resetPracticeTimer();
  practiceWorkbench.classList.add("hidden");
  practiceMenu.classList.remove("hidden");
  practiceLayout.classList.remove("hidden");
  practiceSelects.classList.remove("hidden");
  archivistGame.classList.add("hidden");
  tycoonGame.classList.add("hidden");
  document.querySelector("#practice").scrollIntoView({ behavior: "smooth", block: "start" });
}

function retryPracticeRound() {
  setPracticeItem(practiceState.item);
  practiceInput.focus();
}

function startEditingPost(id) {
  const post = posts.find((item) => item.id === id);
  if (!post || !canEditPost(post)) return;

  editingPostId = id;
  titleInput.value = post.title;
  authorInput.value = post.author;
  categoryInput.value = post.category;
  bodyInput.value = post.body;
  fileName.textContent = "Choose file";
  renderAccess();
  document.querySelector("#submit").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function approvePost(id) {
  if (!isOwner()) return;
  const { error } = await db
    .from("posts")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await refresh();
  openPost(id);
}

async function deletePost(post) {
  if (!canDeletePost(post)) return;
  const { error } = await db.from("posts").delete().eq("id", post.id);

  if (error) {
    alert(error.message);
    return;
  }

  if (editingPostId === post.id) clearPostForm();
  await refresh();
}

function render() {
  renderAccount();
  renderAccess();
  renderCategories();
  renderPosts();
  renderLibrary();
}

async function refresh() {
  if (refreshStarted) return;
  refreshStarted = true;

  try {
    await loadAccount();
    await loadPosts();
  } catch (error) {
    accountMessage.textContent = error.message || "The backend could not be reached.";
    posts = [];
  } finally {
    render();
    refreshStarted = false;
  }
}

async function signInOrCreateAccount({ name, email, password }) {
  if (!db) throw new Error("Supabase did not load. Refresh the page, then try again.");

  let result = await db.auth.signInWithPassword({ email, password });

  if (result.error && result.error.message.toLowerCase().includes("invalid")) {
    result = await db.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: SITE_URL,
        data: {
          display_name: name || email.split("@")[0]
        }
      }
    });
  }

  if (result.error) throw result.error;
  if (!result.data.session) {
    accountMessage.textContent = "Account created. Check your email to confirm, then sign in.";
  }
}

accountForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = accountEmailInput.value.trim().toLowerCase();
  const password = accountPasswordInput.value;
  const name = accountNameInput.value.trim();
  if (!email || !password) return;

  accountMessage.textContent = "";
  accountButton.disabled = true;

  try {
    await signInOrCreateAccount({ name, email, password });
    accountForm.reset();
    await refresh();
  } catch (error) {
    accountMessage.textContent = error.message;
  } finally {
    accountButton.disabled = false;
  }
});

shareButton.addEventListener("click", shareSite);

signOutButton.addEventListener("click", async () => {
  editingPostId = null;
  if (db) await db.auth.signOut();
  account = null;
  accountMessage.textContent = "";
  postForm.reset();
  fileName.textContent = "Choose file";
  await refresh();
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!db) {
    alert("Supabase did not load. Refresh the page, then try again.");
    return;
  }
  if (!isSignedIn()) return;

  const payload = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    category: categoryInput.value,
    body: bodyInput.value.trim(),
    status: isOwner() ? "published" : "pending",
    updated_at: new Date().toISOString()
  };

  if (!payload.title || !payload.author || !payload.body) return;

  if (editingPostId) {
    const existingPost = posts.find((post) => post.id === editingPostId);
    if (!existingPost || !canEditPost(existingPost)) return;

    const { error } = await db.from("posts").update(payload).eq("id", editingPostId);
    if (error) {
      alert(error.message);
      return;
    }

    const updatedId = editingPostId;
    await offerSubstackHandoff(payload);
    clearPostForm({ preserveSubstackNote: true });
    activeCategory = payload.status === "published" ? payload.category : "All";
    await refresh();
    if (payload.status === "published") openPost(updatedId);
    else document.querySelector("#library").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const { data, error } = await db
    .from("posts")
    .insert({
      ...payload,
      submitted_by: account.id
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  await offerSubstackHandoff(payload);
  clearPostForm({ preserveSubstackNote: true });
  activeCategory = data.status === "published" ? data.category : "All";
  await refresh();

  if (data.status === "pending") {
    alert("Saved as pending. The owner will see it in the in-app Library.");
    document.querySelector("#read").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  openPost(data.id);
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  fileName.textContent = file.name;
  const text = await file.text();
  bodyInput.value = text.trim();
  if (!titleInput.value.trim()) {
    titleInput.value = file.name.replace(/\.(txt|md)$/i, "").replace(/[-_]/g, " ");
  }
});

searchInput.addEventListener("input", renderPosts);
sortSelect.addEventListener("change", renderPosts);
clearForm.addEventListener("click", clearPostForm);
closeReader.addEventListener("click", () => readerPanel.classList.add("hidden"));

practiceCards.forEach((card) => {
  card.addEventListener("click", () => openPracticeMode(card.dataset.practiceMode));
});

practiceBackButton.addEventListener("click", closePracticeMode);

practiceDifficulty.addEventListener("change", () => {
  renderPracticeTopics();
  setPracticeItem();
});

practiceTopic.addEventListener("change", () => setPracticeItem());

practiceTimer?.addEventListener("change", () => {
  renderPracticeTimerControls();
  setPracticeItem(practiceState.item);
});

practiceCustomTimer?.addEventListener("change", () => {
  setPracticeItem(practiceState.item);
});

practiceStartButton.addEventListener("click", () => {
  startPracticeTimer();
  practiceInput.focus();
});

practiceFinishButton.addEventListener("click", () => {
  if (practiceState.mode !== "writing-sprint" || practiceState.finished) return;
  if (!practiceState.startedAt) {
    practiceFeedback.textContent = `Start the ${formatSprintLength()} timer first.`;
    practiceInput.focus();
    return;
  }
  if (!practiceInput.value.trim()) {
    practiceFeedback.textContent = "Write a response before finishing the sprint.";
    practiceInput.focus();
    return;
  }

  completePracticeRound(measurePractice(practiceInput.value, practiceState.target));
});

practiceNextButton.addEventListener("click", () => {
  setPracticeItem();
  practiceInput.focus();
});

practiceRetryButton.addEventListener("click", retryPracticeRound);

practiceInput.addEventListener("input", () => {
  if (practiceState.finished) return;
  if (practiceInput.value.length) startPracticeTimer();
  renderPracticeProgress();
});

archivistMode?.addEventListener("change", () => resetArchivistRun());

archivistStartButton?.addEventListener("click", () => {
  if (archivistState.running) return;
  startArchivistRun();
});

archivistResetButton?.addEventListener("click", () => resetArchivistRun());

archivistInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  submitArchiveTag();
});

archivistBellButton?.addEventListener("click", () => {
  if (!archivistState.running || archivistState.bellCharges <= 0 || archivistState.paused) return;
  archivistState.bellCharges -= 1;
  archivistState.paused = true;
  archivistFeedback.textContent = "Archive Bell ringing. The shelves are paused for a moment.";
  renderArchivistStats();
  window.setTimeout(() => {
    if (!archivistState.running || !archivistState.paused) return;
    archivistState.paused = false;
    archivistFeedback.textContent = "The bell fades. Keep shelving.";
    archivistInput.focus();
    renderArchivistStats();
  }, 2500);
});

tycoonNewAssignment?.addEventListener("click", newTycoonAssignment);
tycoonPublish?.addEventListener("click", publishTycoonStory);
tycoonMoveToPublish?.addEventListener("click", moveTycoonDraftToPublish);
tycoonResetProgress?.addEventListener("click", resetTycoonProgress);
tycoonDraft?.addEventListener("input", () => {
  loadTycoonState();
  startTycoonTimer();
  updateTycoonLiveStats();
});

exportButton.addEventListener("click", () => {
  if (!isOwner()) return;
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "common-pages-library.json";
  anchor.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async () => {
  if (!db) return;
  if (!isOwner()) return;
  const file = importInput.files?.[0];
  if (!file) return;

  try {
    const incoming = JSON.parse(await file.text());
    if (!Array.isArray(incoming)) throw new Error("Library import must be an array.");

    const rows = incoming.map((post) => ({
      title: String(post.title || "Untitled"),
      author: String(post.author || "Unknown"),
      category: CATEGORIES.includes(post.category) ? post.category : CATEGORIES[0],
      status: post.status === "pending" ? "pending" : "published",
      body: String(post.body || ""),
      submitted_by: account.id
    }));

    const { error } = await db.from("posts").insert(rows);
    if (error) throw error;
    activeCategory = "All";
    await refresh();
  } catch (error) {
    alert(error.message || "That library file could not be imported.");
  } finally {
    importInput.value = "";
  }
});

resetButton.addEventListener("click", async () => {
  alert("Reset is disabled for the shared database. Delete individual posts from the Library instead.");
});

if (db) {
  db.auth.onAuthStateChange((_event, session) => {
    account = session?.user || null;
    window.setTimeout(async () => {
      try {
        await loadPosts();
      } catch (error) {
        accountMessage.textContent = error.message || "The backend could not be reached.";
        posts = [];
      } finally {
        render();
      }
    }, 0);
  });
}

refresh();
