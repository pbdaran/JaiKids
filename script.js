// ---- SETTINGS: edit these two lines ----
const WHATSAPP_NUMBER = "919876543210"; // country code + number, no + or spaces
const WEB3FORMS_URL = "https://api.web3forms.com/submit"; // key goes in index.html (access_key)
// ----------------------------------------

const form = document.getElementById("enquiry");
const statusEl = document.getElementById("status");
document.getElementById("yr").textContent = new Date().getFullYear();

function say(msg, cls) { statusEl.textContent = msg; statusEl.className = cls || ""; }

function valid() {
  if (form.checkValidity()) return true;
  form.reportValidity();
  say("Please fill the highlighted fields.", "err");
  return false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!valid()) return;
  const btn = form.querySelector("[type=submit]");
  btn.disabled = true; say("Sending your enquiry...");
  try {
    const res = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed");
    form.reset();
    say("Thank you! We have received your enquiry and will call you soon.", "ok");
  } catch (err) {
    say("Could not send. Please use the WhatsApp button or call us.", "err");
  } finally { btn.disabled = false; }
});

document.getElementById("wa-send").addEventListener("click", () => {
  if (!valid()) return;
  const f = new FormData(form);
  const text = [
    "Hello Jai Kids, I would like to enquire.",
    `Parent: ${f.get("parent")}`,
    `Phone: ${f.get("phone")}`,
    `Child's age: ${f.get("age")}`,
    `Program: ${f.get("program")}`,
    `Campus: ${f.get("campus")}`,
    `Van transport: ${f.get("transport")}`,
    f.get("message") ? `Message: ${f.get("message")}` : ""
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});
