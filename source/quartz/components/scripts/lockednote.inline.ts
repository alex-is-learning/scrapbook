// Decrypts a note that scripts/lock-notes.mjs encrypted.
// Payload layout: salt (16 bytes) | iv (12 bytes) | AES-GCM ciphertext, as base64url.

const STORE = "locked-note-passwords"

function savedPasswords(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? "[]")
  } catch {
    return []
  }
}

async function decrypt(payload: string, password: string): Promise<string | null> {
  const binary = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  try {
    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    )
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: bytes.slice(0, 16), iterations: 600000, hash: "SHA-256" },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    )
    const data = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bytes.slice(16, 28) },
      key,
      bytes.slice(28),
    )
    return new TextDecoder().decode(data)
  } catch {
    return null
  }
}

document.addEventListener("nav", async () => {
  const holder = document.querySelector(".locked-note[data-payload]") as HTMLElement | null
  if (!holder) return
  const payload = holder.dataset.payload!

  const open = (plain: string) => {
    holder.outerHTML = JSON.parse(plain).html
  }

  for (const password of savedPasswords()) {
    const plain = await decrypt(payload, password)
    if (plain) return open(plain)
  }

  const form = document.createElement("form")
  const input = document.createElement("input")
  input.type = "password"
  input.placeholder = "Password"
  input.autocomplete = "current-password"
  input.setAttribute("aria-label", "Password")
  const button = document.createElement("button")
  button.type = "submit"
  button.textContent = "Unlock"
  form.append(input, button)
  holder.replaceChildren(form)

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    button.disabled = true
    const plain = await decrypt(payload, input.value)
    button.disabled = false
    if (!plain) {
      input.classList.add("wrong")
      input.select()
      return
    }
    try {
      localStorage.setItem(STORE, JSON.stringify([...new Set([input.value, ...savedPasswords()])]))
    } catch {}
    open(plain)
  })
  input.addEventListener("input", () => input.classList.remove("wrong"))
})
