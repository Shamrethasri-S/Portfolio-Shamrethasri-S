// Motion, navigation, reveal effects and small interactions.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const progress = document.getElementById("scrollProgress");
const nav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}));

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Reveal elements as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("in-view"));
}

// Custom cursor on pointer devices.
const dot = document.querySelector(".cursor--dot");
const ring = document.querySelector(".cursor--ring");
const finePointer = window.matchMedia("(pointer: fine)").matches;
if (finePointer && !reduceMotion) {
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;
  window.addEventListener("mousemove", event => {
    mouseX = event.clientX; mouseY = event.clientY;
    dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
  });
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll("a, button, .skill-group").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
} else {
  dot.style.display = "none"; ring.style.display = "none";
}

// Gentle magnetic pull on the main CTA.
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".magnetic").forEach(button => {
    button.addEventListener("mousemove", event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.10;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.14;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener("mouseleave", () => button.style.transform = "");
  });
}

// Subtle pointer parallax on hero orbits, disabled on touch/reduced motion.
if (finePointer && !reduceMotion) {
  const hero = document.querySelector(".hero");
  const orbits = document.querySelectorAll(".hero-orbit");
  hero.addEventListener("mousemove", event => {
    const x = (event.clientX / innerWidth - .5) * 10;
    const y = (event.clientY / innerHeight - .5) * 10;
    orbits.forEach((orbit, index) => {
      orbit.style.translate = `${x * (index + 1) * .25}px ${y * (index + 1) * .25}px`;
    });
  });
  hero.addEventListener("mouseleave", () => orbits.forEach(orbit => orbit.style.translate = ""));
}

const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

const terminalCommands = {
  help: [
    "Available commands:",
    "about    - Who am I?",
    "skills   - Explore my technical skills",
    "projects - View my development projects",
    "journey  - My learning and achievements",
    "contact  - Get in touch with me",
    "clear    - Clear the terminal"
  ],

  about: [
    "NAME: SHAMRETHASRI S",
    "Computer Science and Engineering student",
    "Mahendra Engineering College.",
    "Aspiring Software Engineer.",
    "I enjoy solving problems and building useful digital experiences."
  ],

  skills: [
    "PROGRAMMING : Java",
    "FRONTEND    : HTML, CSS, JavaScript",
    "DATABASE    : SQL, MySQL",
    "TOOLS       : Git, GitHub",
    "OTHER       : OpenCV"
  ],

  projects: [
    "01 / CAMPUSCONNECTOR",
    "A campus platform connecting students, faculty and campus services.",
    "",
    "02 / REAL-TIME SIGN LANGUAGE INTERPRETER",
    "A computer vision project using OpenCV to recognize hand gestures.",
    "",
    "03 / DYNAMIC SPEED BREAKER CONCEPT",
    "A smart traffic-safety concept focused on sensor-driven detection and automation."
  ],

  journey: [
    "MICROSOFT LEARN STUDENT AMBASSADOR",
    "Best Performer in two technical bootcamps.",
    "Participated in technical communities and bootcamp activities.",
    "Coordinated and conducted technical learning sessions.",
    "Always learning. Always building."
  ],

  contact: [
    "Let's build something meaningful!",
    "EMAIL: shamretha2006@gmail.com",
    "GITHUB: github.com/Shamrethasri-S",
    "MEDIUM: medium.com/@shamretha2006",
    "LINKEDIN: linkedin.com/in/shamrethasri-sivakumar"
  ]
};

function addTerminalLine(text, className = "") {
  const line = document.createElement("p");
  line.className = className;
  line.textContent = text;
  terminalOutput.appendChild(line);
}

terminalForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const command = terminalInput.value.trim().toLowerCase();

  if (!command) return;

  addTerminalLine(
    "visitor@portfolio:~$ " + command,
    "terminal-command"
  );

  terminalInput.value = "";

  if (command === "clear") {
    terminalOutput.innerHTML = "";
    return;
  }

  if (Object.prototype.hasOwnProperty.call(terminalCommands, command)) {
    terminalCommands[command].forEach(line => {
      addTerminalLine(
        line,
        line === "" ? "" : "terminal-success"
      );
    });
  } else {
    addTerminalLine(
      "Command not found. Type 'help' to see available commands.",
      "terminal-muted"
    );
  }

  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});
