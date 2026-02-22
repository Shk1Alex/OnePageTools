(function () {
  const modal = document.getElementById("modal");
  const frame = document.getElementById("modalFrame");
  const img = document.getElementById("modalImage");
  const title = document.getElementById("modalTitle");
  const closeBtn = document.getElementById("closeBtn");
  const openNewTabBtn = document.getElementById("openNewTabBtn");

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

  function openUrlModal(url) {
    currentUrl = url;
    title.textContent = "Opened: " + url;

    img.style.display = "none";
    img.src = "";

    frame.style.display = "block";
    frame.src = url;

    openNewTabBtn.style.display = "inline-block";
    showModal();
  }

  function openImageModal(src) {
    currentUrl = "";
    title.textContent = "Example: " + src;

    frame.style.display = "none";
    frame.src = "about:blank";

    img.style.display = "block";
    img.src = src;

    openNewTabBtn.style.display = "none";
    showModal();
  }

  function closeModal() {
    hideModal();
    frame.src = "about:blank";
    frame.style.display = "none";
    img.src = "";
    img.style.display = "none";
    currentUrl = "";
  }

  document.addEventListener("click", (e) => {
    const example = e.target.closest(".example-link");
    if (example) {
      e.preventDefault();
      openImageModal(example.dataset.image);
      return;
    }

    const link = e.target.closest("a[data-url]");
    if (link) {
      e.preventDefault();
      openUrlModal(link.dataset.url);
    }
  });

  modal.addEventListener("click", (e) => {
    if (!e.target.closest(".modal-panel")) closeModal();
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