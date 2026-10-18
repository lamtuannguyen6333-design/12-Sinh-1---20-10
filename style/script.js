let activeMemberList = [];
window.member = activeMemberList;

let isGifting = false;
let giftInterval = null;

const bgMusic = document.getElementById("bgMusic");
const playlist = [
  "./style/Music/Nơi Pháo Hoa Rực Rỡ.mp3",
  "./style/Music/Mua Hè Của Peppa.mp3"
];
let currentTrackIndex = 0;
let isMusicInitialized = false;

function playTrack(index) {
  if (!bgMusic) return;
  currentTrackIndex = index % playlist.length;
  bgMusic.src = playlist[currentTrackIndex];
  bgMusic.load();
  bgMusic.play().catch(() => {});
}

function nextTrack() {
  playTrack(currentTrackIndex + 1);
}

if (bgMusic) {
  bgMusic.addEventListener("ended", () => {
    nextTrack();
  });
}

const introOverlay = document.getElementById("introOverlay");
const introHeartTrigger = document.getElementById("introHeartTrigger");
const letterSection = document.getElementById("letterSection");
const letterCard = document.getElementById("letterCard");
const letterContent = document.getElementById("letterContent");
const btnOpenMembers = document.getElementById("btnOpenMembers");

const membersSection = document.getElementById("membersSection");
const membersGrid = document.getElementById("membersGrid");
const btnGoToFlowers = document.getElementById("btnGoToFlowers");

const memberModal = document.getElementById("memberModal");
const modalOverlay = document.getElementById("modalOverlay");
const btnModalCloseAction = document.getElementById("btnModalCloseAction");
const modalMemberImg = document.getElementById("modalMemberImg");
const modalMemberName = document.getElementById("modalMemberName");
const modalMemberMess = document.getElementById("modalMemberMess");

const mainContent = document.getElementById("mainContent");
const btnBackToMembers = document.getElementById("btnBackToMembers");

function startMusic() {
  if (!bgMusic) return;

  if (!isMusicInitialized) {
    isMusicInitialized = true;
    bgMusic.src = playlist[currentTrackIndex];
  }

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {
      const resume = () => {
        bgMusic.play().catch(() => {});
        document.removeEventListener("click", resume);
        document.removeEventListener("touchstart", resume);
      };
      document.addEventListener("click", resume, { once: true });
      document.addEventListener("touchstart", resume, { once: true });
    });
  }
}

function createHearts(x, y) {
  const numHearts = 14;
  const icons = ["💖", "🌸", "💕", "✨", "🌷", "💗"];

  for (let i = 0; i < numHearts; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    heart.className = "heart";

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 120;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    heart.style.setProperty("--x", dx);
    heart.style.setProperty("--y", dy);
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    const width = window.innerWidth;
    heart.style.fontSize = width < 600 ? Math.random() * 12 + 12 + "px" : Math.random() * 18 + 16 + "px";
    heart.style.setProperty("--r", Math.random() * 360 - 180 + "deg");

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);
  }
}

document.addEventListener("click", (e) => {
  startMusic();
  createHearts(e.clientX, e.clientY);
});

document.addEventListener("touchstart", (e) => {
  startMusic();
  if (e.touches && e.touches[0]) {
    createHearts(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

async function fetchLetter() {
  const paths = [
    "./style/Letter/letter.txt",
    "./style/letter.txt"
  ];
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }
    } catch (e) {}
  }
  return "";
}

async function fetchMembers() {
  const paths = [
    "./style/Letter/letterMember.txt",
    "./style/letterMember.txt"
  ];
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 0) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            activeMemberList = parsed;
            window.member = activeMemberList;
            return activeMemberList;
          }
        }
      }
    } catch (e) {}
  }
  return [];
}

function renderLetter(letterText) {
  if (!letterContent) return;
  const paragraphs = letterText.split(/\n\s*\n/).filter(p => p.trim() !== "");
  letterContent.innerHTML = paragraphs.map((p, idx) => {
    const formatted = p.replace(/\n/g, "<br>");
    return `<p class="letter-para" style="--para-delay: ${idx * 0.12 + 0.3}s">${formatted}</p>`;
  }).join("");
}

fetchLetter().then(text => {
  if (text) renderLetter(text);
});
fetchMembers();

function onOpenHeartClicked(e) {
  if (e) {
    e.stopPropagation();
  }
  startMusic();

  document.body.classList.remove("container");

  const clientX = e && e.clientX ? e.clientX : window.innerWidth / 2;
  const clientY = e && e.clientY ? e.clientY : window.innerHeight / 2;
  createHearts(clientX, clientY);
  setTimeout(() => createHearts(clientX + 60, clientY - 30), 120);
  setTimeout(() => createHearts(clientX - 60, clientY + 30), 240);

  if (introOverlay) {
    introOverlay.classList.add("fade-out");
    setTimeout(() => {
      introOverlay.style.display = "none";
      introOverlay.style.pointerEvents = "none";
    }, 350);
  }

  if (letterSection) {
    letterSection.classList.remove("hidden");
    letterSection.classList.add("show", "is-opening");
    letterSection.style.display = "flex";

    setTimeout(() => {
      letterSection.classList.remove("is-opening");
      letterSection.classList.add("opened");
    }, 1200);
  }

  fetchLetter().then(text => {
    if (text) renderLetter(text);
  });
  if (!activeMemberList || activeMemberList.length === 0) {
    fetchMembers();
  }
}

if (introHeartTrigger) {
  introHeartTrigger.addEventListener("click", onOpenHeartClicked);
  introHeartTrigger.addEventListener("touchend", onOpenHeartClicked);
}

if (introOverlay) {
  introOverlay.addEventListener("click", onOpenHeartClicked);
}

function getMemberImageSrc(imgName, index) {
  if (!imgName) {
    return `./style/img/Anh (${index + 1}).jpg`;
  }
  if (imgName.startsWith("http://") || imgName.startsWith("https://") || imgName.startsWith("./") || imgName.startsWith("/")) {
    return imgName;
  }
  return `./style/img/${imgName}`;
}

async function renderMemberCards() {
  if (!membersGrid) return;

  if (!activeMemberList || activeMemberList.length === 0) {
    await fetchMembers();
  }

  membersGrid.innerHTML = "";

  activeMemberList.forEach((m, index) => {
    const card = document.createElement("div");
    card.className = "member-card";
    card.setAttribute("data-index", index);

    const fallbackSrc = `./style/img/Anh (${((index % 28) + 1)}).jpg`;
    const imgSrc = getMemberImageSrc(m.img, index);

    card.innerHTML = `
      <div class="member-card-img-wrapper">
        <img class="member-card-img" src="${imgSrc}" alt="${m.name}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackSrc}';">
        <div class="member-card-glow"></div>
      </div>
      <div class="member-card-info">
        <h3 class="member-card-name">${m.name}</h3>
        <span class="member-card-hint">Chạm để mở lời chúc 💕</span>
      </div>
    `;

    card.addEventListener("click", (e) => {
      e.stopPropagation();
      createHearts(e.clientX, e.clientY);
      openMemberModal(m, index);
    });

    membersGrid.appendChild(card);
  });
}

if (btnOpenMembers) {
  btnOpenMembers.addEventListener("click", (e) => {
    e.stopPropagation();

    if (letterSection) {
      letterSection.classList.remove("show", "opened", "is-opening");
      letterSection.classList.add("hidden");
      letterSection.style.display = "none";
    }

    if (membersSection) {
      membersSection.classList.remove("hidden");
      membersSection.classList.add("show");
      membersSection.style.display = "block";
      renderMemberCards();
      membersSection.scrollTop = 0;
    }
  });
}

function openMemberModal(m, index) {
  if (!memberModal) return;

  const fallbackSrc = `./style/img/Anh (${((index % 28) + 1)}).jpg`;
  const imgSrc = getMemberImageSrc(m.img, index);

  if (modalMemberImg) {
    modalMemberImg.src = imgSrc;
    modalMemberImg.onerror = function () {
      if (this.src !== fallbackSrc) this.src = fallbackSrc;
    };
  }

  if (modalMemberName) {
    modalMemberName.textContent = m.name;
  }

  if (modalMemberMess) {
    modalMemberMess.textContent = m.mess || "Chúc bạn một ngày 20/10 ngập tràn niềm vui, luôn xinh đẹp và hạnh phúc! 💖";
  }

  memberModal.classList.remove("hidden");
  memberModal.classList.add("show");
  memberModal.style.display = "flex";
}

function closeMemberModal() {
  if (!memberModal) return;
  memberModal.classList.remove("show");
  memberModal.classList.add("hidden");
  memberModal.style.display = "none";
}

if (btnModalCloseAction) {
  btnModalCloseAction.addEventListener("click", closeMemberModal);
}
if (modalOverlay) {
  modalOverlay.addEventListener("click", closeMemberModal);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && memberModal && memberModal.classList.contains("show")) {
    closeMemberModal();
  }
});

function createFallingImage() {
  if (!isGifting) return;

  const img = document.createElement("img");
  const randomNum = Math.floor(Math.random() * 28) + 1;
  img.src = `./style/img/Anh (${randomNum}).jpg`;
  img.className = "falling-image";

  const width = window.innerWidth;
  const size = width < 600 ? Math.random() * 35 + 45 : Math.random() * 55 + 65;
  const startX = Math.random() * (width - size);
  const duration = Math.random() * 4 + 7;

  img.style.left = startX + "px";
  img.style.width = size + "px";
  img.style.height = size + "px";
  img.style.animationDuration = duration + "s";

  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, duration * 1000);
}

function startFlowerView() {
  if (membersSection) {
    membersSection.classList.remove("show");
    membersSection.classList.add("hidden");
  }

  if (letterSection) {
    letterSection.classList.remove("show", "opened", "is-opening");
    letterSection.classList.add("hidden");
  }

  if (mainContent) {
    mainContent.classList.remove("hidden");
    mainContent.classList.add("show");
  }

  document.body.classList.remove("container");

  isGifting = true;
  if (giftInterval) clearInterval(giftInterval);
  createFallingImage();
  giftInterval = setInterval(createFallingImage, 1200);
}

function backToMembersView() {
  isGifting = false;
  if (giftInterval) clearInterval(giftInterval);
  document.querySelectorAll(".falling-image").forEach(el => el.remove());

  if (mainContent) {
    mainContent.classList.remove("show");
    mainContent.classList.add("hidden");
  }

  if (membersSection) {
    membersSection.classList.remove("hidden");
    membersSection.classList.add("show");
    membersSection.style.display = "block";
    membersSection.scrollTop = 0;
  }
}

if (btnGoToFlowers) {
  btnGoToFlowers.addEventListener("click", (e) => {
    e.stopPropagation();
    createHearts(e.clientX, e.clientY);
    startFlowerView();
  });
}

if (btnBackToMembers) {
  btnBackToMembers.addEventListener("click", (e) => {
    e.stopPropagation();
    backToMembersView();
  });
}
