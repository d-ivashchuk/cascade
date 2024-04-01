"use client";
import { LinkIcon, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import Link from "next/link";

const Page = () => {
  const utils = api.useUtils();
  const lemonSqueezyWebhookQuery = api.ls.getWebhook.useQuery();
  const createLemonSqueezyWebhookMutation = api.ls.createLsWebhook.useMutation({
    onSuccess: () => utils.ls.getWebhook.invalidate(),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Lemon Squeezy setup</h1>
      <p className="prose">
        For <b>local development</b> run the following command in your terminal:{" "}
        <br />
        <code>npx localtunnel --port 3000 --subdomain your-domain</code> and
        copy resulting URL to <b>LEMON_SQUEEZY_WEBHOOK_URL</b> in your .env
        file. It shall look similar to this: <br />
        <i>https://cascade.loca.lt/api/lemon-squeezy/webhook</i>
      </p>
      <p>
        For production webhook use your hosted application url e.g.: <br />
        <i>https://cascade.stackonfire.com/api/lemon-squeezy/webhook</i>
      </p>
      {lemonSqueezyWebhookQuery.isLoading && (
        <Skeleton className="h-[20px] w-[200px]" />
      )}
      {lemonSqueezyWebhookQuery.data && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <h2 className="text-lg">Webhook URL</h2>
            {lemonSqueezyWebhookQuery.data.attributes.url && (
              <Badge variant="destructive" className="max-h-6 self-center">
                {lemonSqueezyWebhookQuery.data.attributes.test_mode
                  ? "Test Mode"
                  : "Production"}
              </Badge>
            )}
          </div>
          <div className="flex space-x-2 text-muted-foreground">
            <div className="flex h-2 w-2 animate-pulse self-center rounded-full bg-green-500" />{" "}
            <p>{lemonSqueezyWebhookQuery.data.attributes.url}</p>
            <Link
              href="https://app.lemonsqueezy.com/settings/webhooks"
              target="_blank"
              className="self-center transition-colors hover:text-foreground"
            >
              <LinkIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex space-x-1">
            {lemonSqueezyWebhookQuery.data.attributes.events.map((event) => (
              <Badge variant="outline" key={event}>
                {event}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <Button
        onClick={() => createLemonSqueezyWebhookMutation.mutate()}
        disabled={
          createLemonSqueezyWebhookMutation.isPending ||
          lemonSqueezyWebhookQuery.isLoading ||
          !!lemonSqueezyWebhookQuery.data?.attributes.url
        }
      >
        {createLemonSqueezyWebhookMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Create Lemon Squeezy webhook
      </Button>
    </div>
  );
};

export default Page;
