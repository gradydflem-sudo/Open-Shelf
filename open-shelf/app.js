const CATEGORIES = ["Essays", "Memoirs", "Fiction", "Notes"];
const STORAGE_KEY = "open-shelf-posts";
const ACCOUNT_KEY = "open-shelf-account";
const OWNER_EMAIL = "gradydflem@gmail.com";
const OWNER_PASSWORD_KEY = "open-shelf-owner-password-hash";

const starterPosts = [
  {
    id: crypto.randomUUID(),
    title: "A Table Near the Window",
    author: "Grady",
    submittedBy: OWNER_EMAIL,
    status: "published",
    category: "Essays",
    date: "2026-07-03T10:00:00.000Z",
    body:
      "There is a particular kind of morning light that turns a room into a promise. It lands first on the table, then on the cup, then on the open page waiting without complaint.\n\nI have started to think of writing as a way of keeping appointments with that light. Not every sentence needs to become permanent. Some only need to prove that we were here, paying attention."
  },
  {
    id: crypto.randomUUID(),
    title: "Borrowed Moon",
    author: "Maya Chen",
    submittedBy: "maya@example.com",
    status: "published",
    category: "Memoirs",
    date: "2026-07-02T18:30:00.000Z",
    body:
      "I carried the moon home\nin the sleeve of my coat,\nsmall enough to misplace,\nbright enough to forgive me.\n\nBy morning it had become\njust a button, just a coin,\njust another round thing\nI wanted to believe in."
  },
  {
    id: crypto.randomUUID(),
    title: "The Mapmaker's Daughter",
    author: "Iris Vale",
    submittedBy: "iris@example.com",
    status: "published",
    category: "Fiction",
    date: "2026-07-01T15:15:00.000Z",
    body:
      "Her father drew coastlines for places he had never touched. He gave each harbor a name, each mountain a shadow, each river a patient blue path to the sea.\n\nWhen he disappeared, he left behind one unfinished map. At the center was a city no one in town recognized, marked with a single instruction: begin here."
  },
  {
    id: crypto.randomUUID(),
    title: "Notebook, July",
    author: "Grady",
    submittedBy: OWNER_EMAIL,
    status: "published",
    category: "Notes",
    date: "2026-07-03T08:45:00.000Z",
    body:
      "Things worth keeping nearby: a pen that does not skip, a sentence that surprises me, names of friends who answer late but honestly, the smell of tomato leaves, and a question that refuses to become small."
  }
];

let posts = loadPosts();
let account = loadAccount();
let activeCategory = "All";
let editingPostId = null;

const accountForm = document.querySelector("#accountForm");
const accountNameInput = document.querySelector("#accountNameInput");
const accountEmailInput = document.querySelector("#accountEmailInput");
const accountPasswordInput = document.querySelector("#accountPasswordInput");
const ownerPasswordField = document.querySelector("#ownerPasswordField");
const ownerPasswordCreateInput = document.querySelector("#ownerPasswordCreateInput");
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
const ownerOnlyControls = [
  exportButton,
  importInput.closest(".import-button"),
  resetButton
];

function loadPosts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizePosts(starterPosts);

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? normalizePosts(parsed) : normalizePosts(starterPosts);
  } catch {
    return normalizePosts(starterPosts);
  }
}

function normalizePosts(postList) {
  return postList.map((post) => ({
    ...post,
    category: post.category === "Poems" ? "Memoirs" : post.category,
    status: post.status || "published",
    submittedBy: post.submittedBy || (post.credit === "Mine" ? OWNER_EMAIL : "legacy-submission@example.com")
  }));
}

function loadAccount() {
  const saved = localStorage.getItem(ACCOUNT_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);
    if (parsed?.email?.toLowerCase() === OWNER_EMAIL && !parsed.ownerAuthenticated) return null;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function saveAccount() {
  if (account) {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    return;
  }
  localStorage.removeItem(ACCOUNT_KEY);
}

function isOwner() {
  return account?.email?.toLowerCase() === OWNER_EMAIL && account.ownerAuthenticated === true;
}

function hasOwnerPassword() {
  return Boolean(localStorage.getItem(OWNER_PASSWORD_KEY));
}

async function hashPassword(password) {
  if (!crypto.subtle) {
    let hash = 5381;
    for (const char of password) {
      hash = ((hash << 5) + hash) ^ char.charCodeAt(0);
    }
    return `local-${hash >>> 0}`;
  }

  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isSignedIn() {
  return Boolean(account?.email);
}

function ownsPost(post) {
  return isSignedIn() && post.submittedBy?.toLowerCase() === account.email.toLowerCase();
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
  return post.submittedBy?.toLowerCase() === OWNER_EMAIL ? "Owner" : "Contributor";
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

function formatReaderBody(text) {
  return String(text)
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
    .join("");
}

function getShareUrl() {
  if (location.protocol === "file:") {
    return "Publish this site to get a public link.";
  }
  return location.origin + location.pathname;
}

async function shareSite() {
  const shareUrl = getShareUrl();
  const shareText = `Read Open Shelf: ${shareUrl}`;

  if (location.protocol === "file:") {
    shareStatus.textContent = "Texting will work once the site has a public web link.";
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Open Shelf",
        text: "Read Open Shelf",
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

function getVisiblePosts() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = posts.filter((post) => {
    if (post.status !== "published") return false;
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const haystack = `${post.title} ${post.author} ${post.body}`.toLowerCase();
    return matchesCategory && (!term || haystack.includes(term));
  });

  return filtered.sort((a, b) => {
    if (sortSelect.value === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortSelect.value === "title") return a.title.localeCompare(b.title);
    return new Date(b.date) - new Date(a.date);
  });
}

function renderAccount() {
  if (isSignedIn()) {
    accountForm.classList.add("hidden");
    accountCard.classList.remove("hidden");
    accountRole.textContent = roleLabel();
    accountName.textContent = `${account.name || account.email} · ${account.email}`;
  } else {
    accountForm.classList.remove("hidden");
    accountCard.classList.add("hidden");
  }
  renderOwnerPasswordField();
}

function renderOwnerPasswordField() {
  const email = accountEmailInput.value.trim().toLowerCase();
  const shouldCreateOwnerPassword = email === OWNER_EMAIL && !hasOwnerPassword();
  ownerPasswordField.classList.toggle("hidden", !shouldCreateOwnerPassword);
  accountButton.textContent = shouldCreateOwnerPassword ? "Create owner login" : "Sign in";
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
    postGrid.innerHTML = `<div class="empty-state">No pieces found.</div>`;
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
    date.textContent = formatDate(post.date);
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
  if (!isSignedIn()) return;

  const sorted = [...getLibraryPosts()].sort((a, b) => new Date(b.date) - new Date(a.date));
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
        <span>${escapeHTML(post.author)} · ${escapeHTML(post.category)} · ${formatDate(post.date)}</span>
        <span>Submitted by ${escapeHTML(post.submittedBy || "unknown")}</span>
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
    item.querySelector('[data-action="approve"]')?.addEventListener("click", () => {
      posts = posts.map((itemPost) => itemPost.id === post.id ? { ...itemPost, status: "published" } : itemPost);
      savePosts();
      render();
      openPost(post.id);
    });
    item.querySelector('[data-action="delete"]')?.addEventListener("click", () => {
      if (!canDeletePost(post)) return;
      posts = posts.filter((itemPost) => itemPost.id !== post.id);
      savePosts();
      if (editingPostId === post.id) clearPostForm();
      render();
    });
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
      <span>${formatDate(post.date)}</span>
    </div>
    <div class="reader-body">${formatReaderBody(post.body)}</div>
  `;
  readerPanel.classList.remove("hidden");
  readerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearPostForm() {
  editingPostId = null;
  postForm.reset();
  fileName.textContent = "Choose file";
  renderAccess();
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

function render() {
  renderAccount();
  renderAccess();
  renderCategories();
  renderPosts();
  renderLibrary();
}

accountForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = accountEmailInput.value.trim().toLowerCase();
  const password = accountPasswordInput.value;
  if (!email) return;

  accountMessage.textContent = "";

  if (email === OWNER_EMAIL) {
    if (hasOwnerPassword()) {
      const savedHash = localStorage.getItem(OWNER_PASSWORD_KEY);
      const attemptedHash = await hashPassword(password);
      if (!password || attemptedHash !== savedHash) {
        accountMessage.textContent = "That owner password does not match.";
        return;
      }
    } else {
      const newOwnerPassword = ownerPasswordCreateInput.value.trim();
      if (newOwnerPassword.length < 8) {
        accountMessage.textContent = "Create an owner password with at least 8 characters.";
        return;
      }
      localStorage.setItem(OWNER_PASSWORD_KEY, await hashPassword(newOwnerPassword));
    }
  }

  account = {
    name: accountNameInput.value.trim() || email.split("@")[0],
    email,
    ownerAuthenticated: email === OWNER_EMAIL
  };
  saveAccount();
  accountForm.reset();
  accountMessage.textContent = "";
  render();
});

accountEmailInput.addEventListener("input", renderOwnerPasswordField);
shareButton.addEventListener("click", shareSite);

signOutButton.addEventListener("click", () => {
  editingPostId = null;
  account = null;
  saveAccount();
  accountMessage.textContent = "";
  postForm.reset();
  fileName.textContent = "Choose file";
  render();
});

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isSignedIn()) return;

  if (editingPostId) {
    const existingPost = posts.find((post) => post.id === editingPostId);
    if (!existingPost || !canEditPost(existingPost)) return;

    const updatedPost = {
      ...existingPost,
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      category: categoryInput.value,
      body: bodyInput.value.trim(),
      status: isOwner() ? "published" : "pending",
      editedAt: new Date().toISOString()
    };

    if (!updatedPost.title || !updatedPost.author || !updatedPost.body) return;

    posts = posts.map((post) => post.id === editingPostId ? updatedPost : post);
    savePosts();
    clearPostForm();
    activeCategory = updatedPost.status === "published" ? updatedPost.category : "All";
    render();
    if (updatedPost.status === "published") {
      openPost(updatedPost.id);
    } else {
      document.querySelector("#library").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  const newPost = {
    id: crypto.randomUUID(),
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    submittedBy: account.email,
    status: isOwner() ? "published" : "pending",
    category: categoryInput.value,
    date: new Date().toISOString(),
    body: bodyInput.value.trim()
  };

  if (!newPost.title || !newPost.author || !newPost.body) return;

  posts = [newPost, ...posts];
  savePosts();
  clearPostForm();
  activeCategory = newPost.status === "published" ? newPost.category : "All";
  render();

  if (newPost.status === "pending") {
    alert("Saved as pending. The owner will see it in the in-app Library.");
    document.querySelector("#read").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  openPost(newPost.id);
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

exportButton.addEventListener("click", () => {
  if (!isOwner()) return;
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "open-shelf-library.json";
  anchor.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async () => {
  if (!isOwner()) return;
  const file = importInput.files?.[0];
  if (!file) return;

  try {
    const incoming = JSON.parse(await file.text());
    if (!Array.isArray(incoming)) throw new Error("Library import must be an array.");

    posts = incoming.map((post) => ({
      ...post,
      id: post.id || crypto.randomUUID(),
      title: String(post.title || "Untitled"),
      author: String(post.author || "Unknown"),
      submittedBy: post.submittedBy || "imported@example.com",
      category: post.category === "Poems" ? "Memoirs" : CATEGORIES.includes(post.category) ? post.category : CATEGORIES[0],
      status: post.status === "pending" ? "pending" : "published",
      date: post.date || new Date().toISOString(),
      body: String(post.body || "")
    }));
    savePosts();
    activeCategory = "All";
    render();
  } catch {
    alert("That library file could not be imported.");
  } finally {
    importInput.value = "";
  }
});

resetButton.addEventListener("click", () => {
  if (!isOwner()) return;
  posts = normalizePosts(starterPosts);
  savePosts();
  activeCategory = "All";
  render();
});

render();
