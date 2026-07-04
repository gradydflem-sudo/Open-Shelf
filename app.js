const SUPABASE_URL = "https://fabucdcrmpdvyukflggx.supabase.co";
const SUPABASE_KEY = "sb_publishable_aPWFDpPUCanreVvU_y9mdg_K3_sH-AV";
const SITE_URL = "https://gradydflem-sudo.github.io/Open-Shelf/";
const OWNER_EMAIL = "gradydflem@gmail.com";
const CATEGORIES = ["Essays", "Memoirs", "Fiction", "Notes"];

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

function formatReaderBody(text) {
  return String(text)
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
    .join("");
}

function getShareUrl() {
  if (location.protocol === "file:") return SITE_URL;
  return location.origin + location.pathname;
}

async function shareSite() {
  const shareUrl = getShareUrl();
  const shareText = `Read Open Shelf: ${shareUrl}`;

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
    clearPostForm();
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

  clearPostForm();
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
