<div align='center'><img src='https://github.com/d-ivashchuk/cascade/assets/29632358/19f1472d-073b-463d-b446-4547628fad04'>
</div>

<div align="center">
  <h2>Open source SaaS starter kit </h2>  
</div>

# Quickstart guide

Clone the repo:

```bash
git clone https://github.com/d-ivashchuk/cascade.git
```
Spin up Postgres in docker headless mode. (Skip this step if you have a managed DB and have a connection string)

```bash
docker compose up -d
```

Copy env variables from the example:

```bash
cp .example.env .env
```

Be sure to populate database urls; at this stage, they are the most important thing to get started locally:

```.env
POSTGRES_PRISMA_URL="postgresql://admin:admin@localhost:5432/cascade_db"
POSTGRES_URL_NON_POOLING="postgresql://admin:admin@localhost:5432/cascade_db"
```

Migrate Prisma & generate client:

```
npx prisma migrate dev
```

Install dependencies & run application 

```
pnpm install && pnpm run dev
```

## Authentication

Set up authentication providers for Next Auth to be able to sign in locally.

[Discord guide](https://next-auth.js.org/providers/discord)
[Google guide](https://next-auth.js.org/providers/google)

```.env
# Next Auth Google Provider
NEXTAUTH_SECRET="super-secret"
NEXTAUTH_URL="http://localhost:3000"

# Next Auth Discord Provider
DISCORD_CLIENT_ID="1221505542334320741"
DISCORD_CLIENT_SECRET="svqvMp9XYtXDbmK3SDEjQFUKphOLc-wK"
```

## Background jobs

Setup trigger for the first time:

[Trigger.dev guide](https://trigger.dev/docs/documentation/quickstarts/nextjs)

Run `npx @trigger.dev/cli@latest dev` in the project directory after setup to establish the channel. You need to setup Slack integration with trigger for notifications to work.

```.env
#Trigger.dev
TRIGGER_API_KEY=tr_dev_XXX
TRIGGER_API_URL=https://api.trigger.dev
NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY=pk_dev_2AO1S8wxhEG8kZSTphsw
```

## Payments

Once you have created an account and store on Lemon Squeezy, make sure you're in **Test mode**, then go to [Settings > API](https://app.lemonsqueezy.com/settings/api) and create a new API key. Copy the key and paste it into `.env` file where it says `LEMON_SQUEEZY_API_KEY=`.

You will also need the store ID from Lemon Squeezy for `LEMON_SQUEEZY_STORE_ID`, which you can find in the list at [Settings > Stores](https://app.lemonsqueezy.com/settings/stores).

Finally, you will need to add a random webhook secret in `LEMON_SQUEEZY_WEBHOOK_SECRET`. A webhook secret is a security key that ensures data received from a webhook is genuine and unaltered, safeguarding against unauthorized access.

Create `LEMON_SQUEEZY_WEBHOOK_URL="https://cascade.loca.lt/api/lemon-squeezy/webhook"` env var

Go to `http://localhost:3000/ls-setup` and click a button to create the webhook on Lemon Squeezy. You are ready to create test subscriptions

```.env
#Lemon Squeezy
LEMON_SQUEEZY_API_KEY="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.XXX"
LEMON_SQUEEZY_STORE_ID="XXX"
LEMON_SQUEEZY_WEBHOOK_SECRET="secret"
LEMON_SQUEEZY_WEBHOOK_URL="https://cascade.loca.lt/api/lemon-squeezy/webhook"
```

## Transactional emails

Register on Loops, get through the onboarding setup, and get the API key to onboarding emails working.

```.env
#Loops
LOOPS_API_KEY="d22b8f8bdf8a57f419fsf5780a444b8d"
```

## Posthog analytics

Register on Posthog, get through onboarding, and paste API keys:

```.env
NEXT_PUBLIC_POSTHOG_API_KEY="phc_eKxBLltchl3KHuezun4XR88arI8nOCisdf4WcQ6KuN9"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

# Honorable mentions
- https://github.com/lmsqueezy/nextjs-billing & [Branko's](https://twitter.com/brankoconjic) work on it; I took a bunch of ideas for LS integration there
- https://github.com/sadmann7/shadcn-table & [Sadman](https://twitter.com/sadmann17) for showcasing brilliant integration of Tanstack table with Shadcn/ui, I repurposed the code for Prisma
- [Pontus](https://twitter.com/pontusab) and his impeccable tech stack in [Midday.ai](https://midday.ai/) inspired me to create the boilerplate at the first place

