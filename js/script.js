// Utilities
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Greeting: keep the visitor name in localStorage and reflect in hero
function setGreeting(name) {
  const greetEl = $("#greet");
  const trimmed = (name || "").trim();
  greetEl.textContent = trimmed ? `Hi, ${trimmed}` : "Hi, Guest";
}

(function initGreeting(){
  const saved = localStorage.getItem("visitorName") || "";
  $("#visitorName").value = saved;
  setGreeting(saved);

  $("#visitorName").addEventListener("input", (e) => {
    const v = e.target.value;
    setGreeting(v);
    localStorage.setItem("visitorName", v);
  });
})();

// Mobile nav toggle
(function navToggleInit(){
  const btn = document.querySelector(".nav-toggle");
  const list = document.querySelector(".nav-links");
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    list.classList.toggle("show");
  });

  // close after click
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => {
    list.classList.remove("show");
    btn.setAttribute("aria-expanded", "false");
  }));
})();

// Footer year
$("#year").textContent = new Date().getFullYear();

// Form validation + show values
const form = $("#contactForm");
const preview = $("#preview");

function setError(id, msg){
  const el = $(`#err-${id}`);
  if (el) el.textContent = msg || "";
}
function clearErrors(){
  ["name","email","phone","message"].forEach(k => setError(k, ""));
}

function validate(data){
  let ok = true;

  // Name: letters & spaces, min 2 chars
  if (!data.name || data.name.trim().length < 2) {
    setError("name", "Please enter your name (min 2 characters).");
    ok = false;
  }

  // Email: basic regex
  const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!emailRE.test(data.email || "")) {
    setError("email", "Please enter a valid email address.");
    ok = false;
  }

  // Phone: digits only, min 9
  const digits = String(data.phone || "").replace(/[^\d]/g,"");
  if (digits.length < 9) {
    setError("phone", "Please enter a valid phone number (min 9 digits).");
    ok = false;
  }

  // Message: min 10 chars
  if (!data.message || data.message.trim().length < 10) {
    setError("message", "Message should be at least 10 characters.");
    ok = false;
  }

  return ok;
}

function renderPreview(data){
  preview.innerHTML = `
    <div class="kv">
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Message:</strong><br/> ${escapeHtml(data.message)}</p>
    </div>
    <p style="color:#aab3d9; margin-top:10px;">*This is a local preview. In a real app you would send data to a backend.</p>
  `;
}

// Prevent XSS in preview
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const data = {
    name: $("#name").value,
    email: $("#email").value,
    phone: $("#phone").value,
    message: $("#message").value
  };

  if (!validate(data)) {
    // focus first error field
    const firstErr = [ ["name","#name"], ["email","#email"], ["phone","#phone"], ["message","#message"] ]
      .find(([k]) => $(`#err-${k}`).textContent.trim().length > 0);
    if (firstErr) $(firstErr[1]).focus();
    return;
  }

  // show on HTML
  renderPreview(data);

  // Optional: sync greeting with submitted name
  localStorage.setItem("visitorName", data.name);
  setGreeting(data.name);

  // Optional UX: clear message only
  $("#message").value = "";
});

// Smooth scroll for older browsers (basic)
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});