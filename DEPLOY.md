# Hosting Koka's Dough House on AWS Amplify

The site is a Next.js app with one server-side piece: the Stripe checkout
(`src/app/api/checkout/route.ts`). AWS Amplify Hosting runs that natively,
rebuilds automatically on every push to GitHub, and includes free HTTPS.

## 1. Deploy (about 10 minutes, all in the AWS console)

1. Sign in to the AWS console and open **AWS Amplify** (region: US East (N. Virginia) is fine for Miami).
2. **Create new app** → **GitHub** → authorize the AWS Amplify GitHub App for
   `jai-nayani/orchids-koka-s-dough-house-website-build` only.
3. Pick the branch to deploy (`main`). Amplify will pick up `amplify.yml` from the repo.
4. Open **Advanced settings** → **Environment variables** and add:
   - `STRIPE_SECRET_KEY` = your Stripe secret key (`sk_test_…` while testing, `sk_live_…` to take real payments)
5. **Save and deploy.** The first build takes 3–5 minutes. You get a URL like
   `https://main.d1abc2def3.amplifyapp.com`.

To switch Stripe from test to live later: change the variable in
**Hosting → Environment variables**, then **Redeploy this version**.

## 2. Set a spending alarm (2 minutes, do this first)

**Billing and Cost Management → Budgets → Create budget → Monthly cost budget**,
amount **$5**, with your email. Budgets are free and will warn you long before the
credits are at risk.

## 3. Custom domain (optional)

`kokasdoughhouse.com` looked unregistered on 2026-11-01.

- Buy it in **Route 53 → Registered domains** (~$15/year for .com), or at any registrar.
  AWS promotional credits usually do **not** cover domain registration, so expect to pay
  for this with your card.
- Then **Amplify → Hosting → Custom domains → Add domain**. If the domain is in Route 53,
  Amplify sets up DNS and the SSL certificate itself.

## What it costs

Amplify Hosting pricing (us-east-1):

| Item | Price | Small bakery site / month |
|---|---|---|
| Builds | $0.01 per build minute | ~10 builds × 3 min ≈ $0.30 |
| Data served | $0.15 per GB | ~2 GB ≈ $0.30 |
| Server requests (checkout, images) | $0.30 per 1M requests + $0.20 per GB-hour | a few cents |
| Storage | $0.023 per GB-month | < $0.01 |
| Route 53 hosted zone (only with a custom domain) | $0.50 | $0.50 |

**Roughly $1–2/month**, so $50 covers years of traffic. In practice the credits'
**expiry date** is the limit. Check it under **Billing → Credits**.

## Taking orders

- Card orders go through Stripe Checkout. Each order's name, phone, delivery method,
  address, date/time and notes are saved on the payment in the **Stripe dashboard**
  (Payments → click the payment → Metadata).
- Turn on **Stripe → Settings → Email notifications → Successful payments** so you get an
  email for each new order.
- The order page also lists Venmo (@kokasdoughhouse) and Zelle as alternatives.
