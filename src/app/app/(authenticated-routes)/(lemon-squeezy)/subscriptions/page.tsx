"use client";
import { Loader2, TestTube2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import { currency } from "~/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";

//lemosqueezy params
const embed = false;
const intervalLabels = {
  day: "day",
  week: "wk",
  month: "mo",
  year: "yr",
};

const Subscriptions = () => {
  const router = useRouter();
  const userSubscriptionsQuery =
    api.paymentManagement.getSubscriptionByUserId.useQuery();

  // Make sure Lemon.js is loaded
  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      console.log("created lemon squeezy");
      window.createLemonSqueezy();
    }
  }, []);

  const storeVariantsQuery =
    api.paymentManagement.getVariantsForStore.useQuery();
  const createCheckoutForVariantMutation =
    api.paymentManagement.createCheckoutForVariant.useMutation();

  return (
    <>
      <div>
        <h1 className="mb-2 text-2xl">Subscriptions</h1>
        <h2 className="text-md text-muted-foreground">
          On this screen you see the availabe subscriptions from Lemon Squeezy
          that user can choose from.
          <br />
          You need to create them first in the{" "}
          <Link
            className="underline"
            href="https://app.lemonsqueezy.com/products"
            target="_blank"
          >
            Lemon Squeezy dashboard
          </Link>
          <br />
          Sync them up in database on{" "}
          <Link className="underline" href="/ls-setup">
            Lemon Squeezy setup page
          </Link>{" "}
          and then you can see them here.
        </h2>
        <Alert className="mt-4">
          <TestTube2 className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            You can test out the subscriptions, select one you would like to try
            & input <code>4242 4242 4242 4242</code> card number with any future
            date and any CVC code.
          </AlertDescription>
        </Alert>
      </div>
      <Separator />
      <div>
        {storeVariantsQuery.isLoading && userSubscriptionsQuery.isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
          </div>
        )}
        {userSubscriptionsQuery.data?.subscription ? (
          <h1>
            You are already subscribed. View your subscription{" "}
            <Link href="/app/billing" className="underline">
              here
            </Link>
          </h1>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {storeVariantsQuery.data?.variants?.map((variant) => (
              <div
                key={variant.id}
                className="divide-y divide-slate-200 rounded-lg border border-b shadow-sm"
              >
                <div className="space-y-4 p-6">
                  <h2 className="text-xl font-bold leading-6 text-foreground">
                    {variant.attributes.name}
                  </h2>
                  <p className="mt-8">
                    <span className="text-4xl font-bold tracking-tighter text-foreground">
                      {currency}
                      {(variant.attributes.price / 100).toFixed(2)}
                    </span>
                    {variant.attributes.interval && (
                      <span className="text-base font-medium text-muted-foreground">
                        /{intervalLabels[variant.attributes.interval]}
                      </span>
                    )}
                  </p>
                  <Button
                    disabled={createCheckoutForVariantMutation.isPending}
                    onClick={() => {
                      createCheckoutForVariantMutation.mutate(
                        {
                          variantId: variant.id,
                          embed,
                        },
                        {
                          onSuccess: (checkout) => {
                            const checkoutUrl =
                              checkout.data?.data.attributes.url;
                            embed
                              ? checkoutUrl &&
                                window.LemonSqueezy.Url.Open(checkoutUrl)
                              : router.push(checkoutUrl ?? "/");
                          },
                        },
                      );
                    }}
                    className="w-full"
                  >
                    {createCheckoutForVariantMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Subscribe
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Subscriptions;
