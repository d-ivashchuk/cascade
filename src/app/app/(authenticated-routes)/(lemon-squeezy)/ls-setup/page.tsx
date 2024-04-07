"use client";
import { AlertCircle, LinkIcon, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { Card } from "~/components/ui/card";
import { currency } from "~/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";

const Page = () => {
  const utils = api.useUtils();
  const lemonSqueezyWebhookQuery = api.paymentManagement.getWebhook.useQuery();
  const lemonSqueezyProductsQuery =
    api.paymentManagement.getProductsFromLemonSqueezy.useQuery();
  const syncProductsFromLemonsqueezyMutation =
    api.paymentManagement.createPlansFromLemonSqueezyVariants.useMutation({
      onSuccess: () =>
        utils.paymentManagement.getProductsFromLemonSqueezy.invalidate(),
    });
  const createLemonSqueezyWebhookMutation =
    api.paymentManagement.createLsWebhook.useMutation({
      onSuccess: () => utils.paymentManagement.getWebhook.invalidate(),
    });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl">Lemon Squeezy setup</h1>
        <Alert className="mt-4 max-w-4xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            This view is avaialbe to anyone for demo purposes. If you are
            cloning Cascade you might want to restrict access to this page.
            <br />
            Any actions on this page are restricted to <b>SUPER_ADMIN</b> role
            only, change your role in the database to access this page.
          </AlertDescription>
        </Alert>
      </div>
      <Separator />
      <h2 className="text-xl">Webhook setup</h2>
      <p>
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
      <Separator />
      <h2 className="text-xl">Plans setup</h2>
      <p>
        Create some products & variants on Lemon Squeezy first and then populate
        your SaaS plans with a single click here
      </p>
      {lemonSqueezyProductsQuery.isLoading && (
        <Skeleton className="h-[20px] w-[200px]" />
      )}
      {lemonSqueezyProductsQuery.data?.map((product) => {
        return (
          <Card key={product.id} className="space-y-2 p-4">
            <div className="flex space-x-2">
              <h3 className="text-lg">{product.attributes.name}</h3>
              <Link
                href={`https://app.lemonsqueezy.com/products/${product.id}`}
                target="_blank"
                className="self-center transition-colors hover:text-foreground"
              >
                <LinkIcon className="h-4 w-4" />
              </Link>
            </div>
            <p>{product.attributes.description ?? "Missing description"}</p>
            <Separator />
            {
              <div className="space-y-2">
                {product.variants?.map((variant) => {
                  return (
                    <div key={variant.id} className="flex space-x-2">
                      {variant.hasCorrespondingPlanInDB && (
                        <Badge>Synced</Badge>
                      )}
                      <p>{variant.attributes.name}</p>
                      <p>
                        {currency}
                        {(variant.attributes.price / 100).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            }
          </Card>
        );
      })}

      <Button
        onClick={() => syncProductsFromLemonsqueezyMutation.mutate()}
        disabled={syncProductsFromLemonsqueezyMutation.isPending}
      >
        {syncProductsFromLemonsqueezyMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Sync Lemon Squeezy products to Saas plans
      </Button>
    </div>
  );
};

export default Page;
