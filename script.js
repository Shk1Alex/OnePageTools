(function () {
  const modal = document.getElementById("modal");
  const frame = document.getElementById("modalFrame");
  const img = document.getElementById("modalImage");
  const custom = document.getElementById("modalCustom");

  const title = document.getElementById("modalTitle");
  const closeBtn = document.getElementById("closeBtn");
  const openNewTabBtn = document.getElementById("openNewTabBtn");

  const addBtn = document.getElementById("addLinkBtn");
  const form = document.getElementById("linkForm");
  const saveBtn = document.getElementById("saveLinkBtn");
  const cancelBtn = document.getElementById("cancelLinkBtn");
  const nameInput = document.getElementById("linkName");
  const urlInput = document.getElementById("linkUrl");
  const errorEl = document.getElementById("formError");
  const linksList = document.getElementById("linksList");

  const STORAGE_KEY = "custom_useful_links_v1";

  let currentUrl = "";

  function showModal() {
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function hideModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function resetModalContent() {
    frame.style.display = "none";
    frame.src = "about:blank";

    img.style.display = "none";
    img.src = "";

    custom.style.display = "none";

    openNewTabBtn.style.display = "inline-block";
    currentUrl = "";
  }

  function closeModal() {
    hideModal();
    resetModalContent();
  }

  function openUrlModal(url) {
    resetModalContent();
    currentUrl = url;

    title.textContent = "Opened: " + url;
    frame.style.display = "block";
    frame.src = url;

    openNewTabBtn.style.display = "inline-block";
    showModal();
  }

  function openImageModal(src) {
    resetModalContent();

    title.textContent = "Example";
    img.style.display = "block";
    img.src = src;

    openNewTabBtn.style.display = "none";
    showModal();
  }

  function openCustomLinksModal() {
    resetModalContent();

    title.textContent = "Custom Useful Links";
    custom.style.display = "block";
    openNewTabBtn.style.display = "none";

    renderCustomLinks();
    showModal();
  }

  function readLinks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeLinks(links) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }

  function normalizeUrl(url) {
    const trimmed = (url || "").trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return "https://" + trimmed;
  }

  function isValidUrl(url) {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add("show");
  }

  function clearError() {
    errorEl.textContent = "";
    errorEl.classList.remove("show");
  }

  function renderCustomLinks() {
    const links = readLinks();
    linksList.innerHTML = "";

    if (!links.length) {
      linksList.innerHTML = `
        <li class="custom-links-item">
          <div>
            <div style="color: var(--muted); font-weight: 650;">No links yet</div>
            <small>Add your first one with “Add link”.</small>
          </div>
        </li>
      `;
      return;
    }

    links.forEach((l) => {
      const li = document.createElement("li");
      li.className = "custom-links-item";

      li.innerHTML = `
        <div>
          <a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a>
          <small>${l.url}</small>
        </div>
        <button class="icon-btn" type="button" data-remove="${l.id}">Remove</button>
      `;

      linksList.appendChild(li);
    });
  }

  addBtn.addEventListener("click", () => {
    clearError();
    form.classList.add("show");
    nameInput.value = "";
    urlInput.value = "";
    nameInput.focus();
  });

  cancelBtn.addEventListener("click", () => {
    clearError();
    form.classList.remove("show");
  });

  saveBtn.addEventListener("click", () => {
    clearError();

    const name = (nameInput.value || "").trim();
    const url = normalizeUrl(urlInput.value);

    if (!name) {
      showError("Name is required.");
      return;
    }

    if (!url || !isValidUrl(url)) {
      showError("URL is invalid. Use http(s)://...");
      return;
    }

    const current = readLinks();
    const newItem = { id: Date.now(), name, url };

    writeLinks([newItem, ...current]);
    form.classList.remove("show");
    renderCustomLinks();
  });

  linksList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;

    const id = Number(btn.getAttribute("data-remove"));
    const next = readLinks().filter((x) => Number(x.id) !== id);

    writeLinks(next);
    renderCustomLinks();
  });

  document.addEventListener("click", (e) => {
    const example = e.target.closest(".example-link");
    if (example) {
      e.preventDefault();
      openImageModal(example.dataset.image);
      return;
    }

    const action = e.target.closest("[data-action]");
    if (action) {
      e.preventDefault();
      if (action.dataset.action === "custom-links") {
        openCustomLinksModal();
      }
      return;
    }

    const link = e.target.closest("a[data-url]");
    if (link) {
      e.preventDefault();
      openUrlModal(link.dataset.url);
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  closeBtn.addEventListener("click", closeModal);

  openNewTabBtn.addEventListener("click", () => {
    if (!currentUrl) return;
    window.open(currentUrl, "_blank", "noopener,noreferrer");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });
})();