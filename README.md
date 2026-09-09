# 4B Traders — Website + Admin CMS

A premium 3D jutti/khussa e-commerce site (Next.js, Three.js, GSAP, Tailwind) with a
real, database-backed Admin Dashboard at `/admin`. Nothing here is hardcoded or fake:
every admin action reads and writes real rows in Supabase, and the public site reads
those same rows live.

## How the pieces talk to each other

```
Public Website (Next.js pages)   Admin Dashboard (/admin, Next.js pages)
        │                                    │
        │   both use the same Supabase       │
        │   URL + anon key (never the        │
        │   secret service-role key)         │
        ▼                                    ▼
              Supabase (Postgres + Auth + Storage)
              - Row Level Security decides what each
                request is allowed to read/write
              - "media" storage bucket holds all images
```

- **Public pages** (`app/page.js`, `app/products`, `app/about`, `app/gallery`,
  `app/contact`, …) fetch content server-side via `lib/publicData.js`, which is
  covered by "public can read active/settings" RLS policies — no login needed.
- **Admin pages** (`app/admin/**`) run in the browser, call Supabase directly with
  `lib/supabaseClient.js`, and are gated two ways: `middleware.js` redirects anyone
  without a session away from `/admin/*`, and every table has an `is_admin()` RLS
  check in Postgres so even a logged-in-but-not-admin account can't read or write
  protected data. That second layer is the real security boundary.
- **Images** go straight from the browser to the Supabase `media` storage bucket
  (`components/ImageUpload.jsx`), which returns a public URL that gets saved into
  the relevant table row (product, gallery item, homepage hero, etc.).
- Edit something in `/admin` → it's a row update in Postgres → the public page
  re-fetches that row on next load/refresh. That's the whole loop.

## Project structure

```
app/
  page.js, products/, about/, gallery/, contact/, cart/   ← public site
  admin/
    login/                 ← admin sign-in
    page.js                ← dashboard home (live stats)
    products/, categories/, orders/, customers/            ← core commerce
    homepage/, about/, gallery/, testimonials/              ← content CMS
    contact/, social/, settings/                            ← site-wide settings
    media/                  ← media library
components/                 ← shared UI (ImageUpload, ConfirmDialog, ProductForm, …)
lib/
  supabaseClient.js         ← browser client (anon key only)
  supabaseServer.js         ← server client for public page data fetching
  useAdmin.js                ← "is this user a logged-in admin?" hook
  publicData.js              ← read helpers for the public site
supabase/
  schema.sql                 ← all tables + Row Level Security policies
  storage_setup.sql          ← storage bucket policies (run after creating the bucket)
middleware.js                ← redirects unauthenticated visitors away from /admin
```

## Setup — from zero to a running site

### 1. Create the Supabase project
Go to supabase.com → New project. Pick a name, a database password (save it), and a region close to you. Wait ~2 minutes for it to provision.

### 2. Create the database tables
In your Supabase project: **SQL Editor → New query**, paste the entire contents of `supabase/schema.sql`, and run it. This creates every table (products, categories, orders, customers, homepage_content, about_content, gallery, testimonials, website_settings, admin_users) plus Row Level Security policies.

### 3. Configure authentication
**Authentication → Providers**: make sure **Email** is enabled (it is by default). You don't need to change anything else — the app uses Supabase's built-in email/password auth for the admin login.

### 4. Create the storage bucket
**Storage → New bucket** → name it exactly `media` → make it **Public**. This is where every uploaded image (products, gallery, banners, logo) lives.

### 5. Apply storage security policies
Back in **SQL Editor**, paste and run the contents of `supabase/storage_setup.sql`. This lets anyone *view* images (so the public site can show them) but only admins can upload/replace/delete.

### 6. Get your Supabase URL and anon key
**Project Settings → API**. Copy:
- **Project URL**
- **anon / public key**

⚠️ **Never copy the `service_role` key into this project.** That key bypasses all security and must never appear in frontend code — this project never asks for it.

### 7. Configure environment variables
Copy `.env.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=<your project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
NEXT_PUBLIC_WHATSAPP_NUMBER=<your real WhatsApp number, digits only with country code>
```

### 8. Create the first admin account
1. In Supabase: **Authentication → Users → Add user** → enter the owner's email + a password → **Create user**.
2. Copy that new user's UUID (shown in the users list).
3. **SQL Editor**, run:
   ```sql
   insert into admin_users (id, email) values ('<paste-the-uuid>', 'owner@example.com');
   ```
   This is what actually makes them an admin — a Supabase login alone isn't enough (see `is_admin()` in `schema.sql`).

### 9. Install and run locally
```
npm install
npm run dev
```
Open **http://localhost:3000** for the public site.

### 10. Open the admin panel
Go to **http://localhost:3000/admin** and log in with the email/password from step 8. `/admin` is not linked from the public navigation on purpose.

### 11. Add your first product
**Admin → Products → Add Product**. Fill in name, price, category, sizes/colors, stock, and upload at least one image. Save — it appears on the public `/products` page immediately (refresh to see it).

### 12. Upload product images
Product images upload straight into the `media` bucket from the product form (or from **Admin → Media Library** for anything else, like banners). Max 5MB per file; JPG/PNG/WEBP/GIF only.

### 13. Update homepage content
**Admin → Homepage** to edit the hero heading/image/button, the promotional banner, and which products are marked "Featured." **Admin → About Us**, **Gallery**, **Testimonials**, **Contact Information**, **Social Links**, and **Website Settings** work the same way — edit, save, refresh the public page.

### 14. Manage orders
When a customer checks out on the public site, an order (and customer record) is created. **Admin → Orders** shows every order with a status dropdown (Pending → Confirmed → Processing → Shipped → Delivered → Cancelled). **Admin → Customers** shows anyone who has placed at least one order, with their order count and total spend.

### 15. Deploy to production
Push this project to GitHub, then import it into **Vercel** (or any Next.js host). In the host's environment variable settings, add the same three variables from step 7. Vercel builds and deploys automatically on every push. Your Supabase project doesn't need any changes for production — the same URL/keys work everywhere.

## Notes

- **No fake data anywhere**: dashboard stats, product lists, orders, and customers all come from live Supabase queries. An empty database means empty (not placeholder) lists until you add real content.
- **No placeholder testimonials or contact details ship pre-filled** — add your own real ones through the admin panel.
- `next@14.2.5` has a known security advisory; consider running `npm audit` and upgrading to the latest 14.x patch before going to production.
