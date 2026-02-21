(function () {
  const modal = document.getElementById("modal");
  const frame = document.getElementById("modalFrame");
  const title = document.getElementById("modalTitle");
  const closeBtn = document.getElementById("closeBtn");
  const openNewTabBtn = document.getElementById("openNewTabBtn");

  let currentUrl = "";

  function openModal(url) {
    currentUrl = url;
    title.textContent = "Opened: " + url;
    frame.src = url;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    frame.src = "about:blank";
    currentUrl = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-url]");
    if (!link) return;

    e.preventDefault();
    openModal(link.dataset.url);
  });

  modal.addEventListener("click", (e) => {
    const panel = e.target.closest(".modal-panel");
    if (!panel) closeModal();
  });

  closeBtn.addEventListener("click", closeModal);

  openNewTabBtn.addEventListener("click", () => {
    if (!currentUrl) return;
    window.open(currentUrl, "_blank", "noopener,noreferrer");
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      modal.getAttribute("aria-hidden") === "false"
    ) {
      closeModal();
    }
  });
})();