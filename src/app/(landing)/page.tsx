import {
  SiGithub,
  SiNextdotjs,
  SiPostgresql,
  SiPosthog,
  SiPrisma,
  SiSentry,
  SiStorybook,
  SiTailwindcss,
  SiTrpc,
} from "@icons-pack/react-simple-icons";

import { type Metadata } from "next";

import LsLogo from "./ls-logo";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import Link from "next/link";
import { Terminal } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import Image from "next/image";
import VideoComponent from "./video-component";

import CloneRepoBadge from "./clone-repo-badge";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Cascade -  free open-source SaaS boilerplate",
  description:
    "Kickstart your SaaS project with Cascade - open-source SaaS boilerplate. Payments, error tracking, analytics, background jobs, email marketing. All in one package.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    url: "https://cascade.stackonfire.com",
    title: "Cascade - open-source SaaS boilerplate",
    description:
      "Kickstart your SaaS project with Cascade - open-source SaaS boilerplate. Payments, error tracking, analytics, background jobs, email marketing. All in one package.",
    images: [
      {
        url: "https://cascade.stackonfire.com/api/og",
        width: 800,
        height: 600,
        alt: "Cascade logo",
      },
    ],
  },
};

const Logos = () => {
  return (
    <>
      <li>
        <SiNextdotjs className="h-14 w-14 p-2" />
      </li>
      <li>
        <SiTrpc className="h-14 w-14 p-2" />
      </li>
      <li>
        <LsLogo className="mb-auto h-12 w-12 fill-emerald-200" />
      </li>
      <li>
        <SiPrisma className="h-14 w-14 p-2" />
      </li>
      <li>
        <SiPostgresql className="h-14 w-14 p-2" />
      </li>
      <li>
        <SiTailwindcss className="h-14 w-14 p-2" />
      </li>
      <li>
        <SiSentry className="h-14 w-14 p-2" />
      </li>
      <li>
        <SiPosthog className="h-14 w-14 p-2" />
      </li>
      <li>
        <SiStorybook className="h-14 w-14 p-2" />
      </li>
    </>
  );
};

export default async function Home() {
  const stargazersQuery = await fetch(
    `https://api.github.com/repos/d-ivashchuk/cascade`,
    {
      next: { revalidate: 60 * 60 },
    },
  );
  const lastCommitQuery = await fetch(
    `https://api.github.com/repos/d-ivashchuk/cascade/commits`,
    {
      next: { revalidate: 60 * 60 },
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const stargazersData: { stargazers_count: number } =
    await stargazersQuery.json();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const lastCommitData: { commit: { committer: { date: string } } }[] =
    await lastCommitQuery.json();

  return (
    <div className="px-4">
      <Image
        src="./cd.svg"
        width={100}
        height={100}
        alt="cascade logo"
        className=" mx-auto mb-4 rounded-md md:block "
      />
      <div className="mb-4 flex flex-col justify-center text-center align-middle">
        <div className="mb-4">
          <h1 className="mb-2 text-4xl font-bold uppercase">Cascade</h1>
          <h2 className="mb-2 text-xl text-muted-foreground">
            Free and <b>open-source</b> SaaS boilerplate. <br />
          </h2>
          {lastCommitData[0] && (
            <Badge variant="outline" className="mx-auto max-w-4xl">
              <div className=" mr-2 h-2 w-2 animate-ping rounded-full bg-green-400 duration-1000" />
              Last updated on{" "}
              {format(new Date(lastCommitData[0].commit.committer.date), "PP")}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 self-center align-middle">
          <Link href="/app/login">
            <Button>Try demo</Button>
          </Link>
          <Link target="_blank" href="https://github.com/d-ivashchuk/cascade">
            <Button variant="outline">
              <SiGithub className="mr-2 h-4 w-4" />{" "}
              {stargazersData
                ? stargazersData.stargazers_count
                : "Code on GitHub"}
            </Button>
          </Link>
          <Link href="https://stackonfire.mintlify.app/introduction">
            <Button variant="outline">Docs</Button>
          </Link>
        </div>
        <CloneRepoBadge />
      </div>
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mt-4 inline-flex w-full  flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
          <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
            <Logos />
          </ul>
          <ul
            className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8"
            aria-hidden="true"
          >
            <Logos />
          </ul>
        </div>
      </div>

      <VideoComponent />

      <div className="mx-auto max-w-4xl">
        <div className="my-16">
          <Tabs defaultValue="architecture">
            <TabsList className="flex self-center">
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="concept">Concept</TabsTrigger>
            </TabsList>
            <TabsContent value="architecture">
              <div className="max-w-3xl">
                <p className="prose lg:prose-xl mx-auto">
                  Cascade is based on{" "}
                  <Link className="underline" href="https://create.t3.gg/">
                    T3 Stack
                  </Link>
                  . It is a fullstack boilerplate that is relying on{" "}
                  <Link className="underline" href="https://trpc.io/">
                    tRPC
                  </Link>{" "}
                  &{" "}
                  <Link className="underline" href="https://nextjs.org/">
                    Next.js
                  </Link>
                  . <br />
                  Cascade is a <b>SaaS boilerplate</b> meaning it is making
                  opinionated choices when it comes to technologies used on top
                  of T3 base stack. <br />
                </p>
                <Alert className="mt-4">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Main goal of Cascade is to get you from <b>ideation</b> to{" "}
                    <b>first sale</b> as fast as possible. After that the
                    template is designed to support <b>growth and scale</b> .
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
            <TabsContent value="tools">
              Cascade mainly relies on <b>open-source</b> tools and services to
              the main extent. There are some <b>paid services</b> included in
              the starter template, but those are either industry standards or
              tools critically acclaimed by the community. <br /> <br />
              Most importantly Cascade is designed to be <b>cost-effective</b>.
              All of the paid services are having generous free plans and will
              not require any costs unless you have big amounts of users.
            </TabsContent>
            <TabsContent value="concept">
              Cascade differs from the most of the templates because it covers
              not only the <b>technical side</b> of the things but also the{" "}
              <b>business side</b>.
              <br /> <br />
              Cascade template is designed in a way to help you:
              <ul className="list-disc">
                <li>
                  Build your business logic from <b>Day 1</b> with existing code
                  setup
                </li>
                <li>
                  Get your first paying customers with simple but comprehensive
                  payment setup
                </li>
                <li>
                  Evolve your business with tools to monitor user behaviors &
                  errors in your codebase.
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
        <Separator className="my-4" />
        <h2 className="mb-4 text-center text-3xl">
          What is covered in template
        </h2>
        <h3 className="mb-4 text-center text-2xl">
          <b>Technical</b>
        </h3>
        <ul className="list-disc">
          <li>
            Basic T3 stack setup with Next.js, Prisma, PostgreSQL, TailwindCSS.
          </li>
          <li>
            Styling with shadcn/ui components for fast UI prototyping |{" "}
            <b>Dark/light theme, TanStack Table integration</b>
          </li>
          <li>
            Authentication with Next Auth | <b>Discord & Google examples</b>{" "}
          </li>
          <li>
            Payments with Lemon Squeezy |{" "}
            <b>Checkout sessions, Subscriptions, One time payments</b>
          </li>
          <li>
            Background jobs with Trigger.dev |{" "}
            <b>Slack notifications on new Users, background job processing</b>
          </li>
          <li>
            Error handling with Sentry |{" "}
            <b>Monitoring, Alerts, Issue tracking</b>
          </li>
          <li>
            Storybook | <b>Component library, Documentation</b>
          </li>
          <li>
            GitHub actions | <b>CI/CD, Automated testing</b>
          </li>
          <li>
            Lost Pixel | <b>Visual regression testing</b>
          </li>
        </ul>
        <h3 className="mb-4 mt-8 text-center text-2xl">
          <b>Business</b>
        </h3>
        <ul className="list-disc">
          <li>Simple markdown blog with Contentlayer </li>
          <li>
            SEO with Next.js |{" "}
            <b>Dynamic Sitemap,Dynamic Open Graph, Twitter Cards</b>
          </li>
          <li>
            Email user flows with Loops |{" "}
            <b>
              Welcome emails for newly signed up users, newsletter subscription
            </b>
          </li>
          <li>
            Analytics with Posthog |{" "}
            <b>Event tracking, User behavior analysis</b>
          </li>
          <li>
            Analytics with Plausible | <b>Page analytics</b>
          </li>
        </ul>
      </div>
    </div>
  );
}
