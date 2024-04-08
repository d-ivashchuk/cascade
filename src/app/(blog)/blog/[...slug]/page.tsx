import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";

import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { env } from "~/env.mjs";

import { buttonVariants } from "~/components/ui/button";
import { absoluteUrl, cn, formatDate } from "~/lib/utils";
import { ChevronLeft } from "lucide-react";

import MdxContent from "./mdx-content";
import Newsletter from "./newsletter";

interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostPageProps["params"]) {
  const slug = params?.slug?.join("/");
  const post = allPosts.find((post) => post.slugAsParams === slug);

  if (!post) {
    null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  const ogUrl = new URL(`${env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.image}`);

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(post.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  };
}

export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    notFound();
  }

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex",
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        See all posts
      </Link>
      <div>
        {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )}
        <h1 className="font-heading mt-2 inline-block text-4xl leading-tight lg:text-5xl">
          {post.title}
        </h1>
        <Link
          href={`https://twitter.com/divdev_`}
          target="_blank"
          className="mt-4 flex items-center space-x-2 text-sm"
        >
          <Image
            src="/images/avatar.jpeg"
            alt="Dimitri Ivashchuk"
            width={42}
            height={42}
            className="rounded-full bg-white"
          />
          <div className="flex-1 text-left leading-tight">
            <p className="font-medium">Dima</p>
            <p className="text-[12px] text-muted-foreground">@DivDev_</p>
          </div>
        </Link>
      </div>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="my-8 rounded-md border bg-muted transition-colors"
          priority
        />
      )}
      <MdxContent code={post.body.code} />
      <hr className="mt-12" />
      <Newsletter />

      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  );
}
