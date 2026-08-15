[README.md](https://github.com/user-attachments/files/31099595/README.md)
# Alora — your website, explained plainly

You don't need to know how to code to use this. This README walks through
everything with zero jargon. Read it top to bottom once before you start.

## What you have

A folder with 4 files:
- `index.html` — the page content (text, layout)
- `style.css` — the colours, fonts, spacing
- `script.js` — the shopping cart and checkout logic
- `assets/logo.png` — your Alora logo

Open `index.html` by double-clicking it right now — it opens in your browser
and the whole site (cart included) already works, before you change anything.

---

## Step 1 — Put in your real products

Open `script.js` in any text editor (Notepad, TextEdit, or VS Code) and find
the `PRODUCTS` list near the top. Each product looks like this:

```
{ id: "d1", name: "Terracotta Wrap Dress", category: "Dresses", price: 2499, shape: "dress", tint: "maroon" },
```

Change `name`, `category` (must be `Dresses`, `Tops`, or `Bottoms`), and
`price` for each of your real 6–15 items. Leave `id`, `shape`, and `tint`
alone unless you're comfortable experimenting.

## Step 2 — Add real product photos (optional but recommended)

Right now each product shows a simple line-drawing placeholder so the site
looks intentional instead of broken. To use real photos:

1. Make a folder called `images` inside this project folder.
2. Drop your product photos in there (square or 3:4 photos work best).
3. In `script.js`, add an `img: "images/yourfile.jpg"` field to a product.
4. In `index.html`, find the `product-media` section in the `renderGrid`
   function inside `script.js`, and ask an AI coding tool (or me, if you're
   chatting with Claude) to "swap the SVG placeholder for an `<img>` tag
   using the `img` field" — this is a five-minute change I'm happy to make
   for you directly if you upload your photos.

## Step 3 — See your site live for free (no domain needed yet)

Easiest option: **Netlify Drop**.

1. Go to https://app.netlify.com/drop in your browser.
2. Drag your whole `alora-store` folder onto the page.
3. Netlify gives you a live link instantly (like `random-name-123.netlify.app`).

That's it — your store is now live on the internet, for free, with no
account required for this basic drop method.

## Step 4 — Add your own domain (optional, ~₹500–1000/year)

1. Buy a domain (e.g. `alora.com`) from Namecheap, GoDaddy, or Google Domains.
2. In Netlify, make a free account, claim the site you dropped, go to
   **Domain settings → Add custom domain**, and follow their steps to point
   your domain at Netlify. They walk you through it with no coding.

---

## Step 5 — Turn on real payments

Right now, clicking **Pay with Razorpay** shows a message and falls back to
WhatsApp checkout, because the site ships with a placeholder key.

**To accept real card/UPI payments:**

1. Create a free account at https://razorpay.com and complete their KYC
   (needed for any Indian payment gateway, no-code or not).
2. In your Razorpay dashboard, go to **Settings → API Keys** and generate a
   **Live** key. Copy the `Key ID` (starts with `rzp_live_...`).
3. Open `script.js`, find this line near the bottom:
   ```
   const RAZORPAY_KEY_ID = "rzp_test_XXXXXXXXXXXX";
   ```
   Replace the placeholder with your real key ID, keeping the quotes.
4. Re-upload the folder to Netlify (drag and drop again, or connect it to
   GitHub for auto-updates — Netlify's onboarding covers this).

**Important security note:** this checkout sends the cart total directly
from the browser to Razorpay, which is fine for a small store getting
started, but a technically savvy person could tamper with the amount before
paying. Once you're doing meaningful volume, ask a developer (or hire one
for a few hours on Upwork) to move the order-amount calculation to a small
server function — Razorpay's own docs call this the "Orders API," and
Netlify's free "Functions" feature can host it without a full backend.

## Step 5b — Turn on direct UPI payment (recommended — easiest real option)

This is the fastest way to accept real money with zero gateway signup or fees.

1. Open any UPI app you already use (GPay, PhonePe, Paytm, your bank's app)
   and find your **UPI ID** (also called a VPA) — it looks like
   `yourname@okaxis` or `yourbusiness@ybl`. If you don't have one for your
   business yet, most banks let you generate one free in their app under
   "UPI ID" or "Manage UPI IDs."
2. Open `script.js` and find:
   ```
   const UPI_ID = "alora@okaxis";
   ```
   Replace it with your real UPI ID.
3. That's it. On the live site: customers on a phone tap **Pay via UPI** and
   it opens their GPay/PhonePe/Paytm app with your ID and the exact order
   amount already filled in — they just confirm. On a desktop browser, it
   shows a QR code they can scan with their phone instead.

**One thing to know:** direct UPI like this doesn't automatically tell your
website "payment received" — there's no gateway in between confirming it.
Ask the customer to send a screenshot on WhatsApp after paying, or check
your bank app for the credit before shipping. This is completely normal for
small brands and is how most Instagram/WhatsApp clothing sellers in India
already operate. Razorpay (Step 5) also accepts UPI, and does confirm
payment automatically — worth switching to once you're doing steady volume.

## Step 6 — WhatsApp checkout (works immediately, no setup)

The **Order via WhatsApp instead** button already works — it opens WhatsApp
with the customer's order pre-filled as a message to you. Just replace the
placeholder number in `script.js`:

```
const WHATSAPP_NUMBER = "910000000000"; // replace with your number, country code + number, no +, no spaces
```

Many small Indian clothing brands run entirely on this + a UPI QR code
screenshot sent back manually — genuinely fine while you're starting out.

---

## Quick checklist before you launch

- [ ] Real products and prices in `script.js`
- [ ] Real product photos in `images/` (or keep the placeholder art)
- [ ] `WHATSAPP_NUMBER` updated
- [ ] `UPI_ID` updated to your real UPI ID
- [ ] `RAZORPAY_KEY_ID` updated (once Razorpay KYC is approved)
- [ ] Footer email/address in `index.html` updated
- [ ] Site dropped onto Netlify and link tested on your phone

If you get stuck on any step, come back with a screenshot of what you're
seeing and I'll walk you through it.
