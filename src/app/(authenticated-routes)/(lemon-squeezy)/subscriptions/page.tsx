"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

//lemosqueezy params
const embed = false;
export const currency = "€";
const intervalLabels = {
  day: "day",
  week: "wk",
  month: "mo",
  year: "yr",
};

const Subscriptions = () => {
  const router = useRouter();

  // Make sure Lemon.js is loaded
  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      console.log("created lemon squeezy");
      window.createLemonSqueezy();
    }
  }, []);

  const productByIdQuery = api.ls.getProductById.useQuery({
    productId: "235208",
    hideDefaultVariant: true,
  });
  const storeId = productByIdQuery.data?.product?.data.attributes.store_id;
  const createCheckoutForVariantMutation =
    api.ls.createCheckoutForVariant.useMutation();

  return (
    <div className="space-y-8 p-10 sm:flex sm:justify-center sm:space-x-8 sm:space-y-0">
      {productByIdQuery.isLoading && (
        <>
          <Skeleton className="h-[180px] w-[200px] " />
          <Skeleton className="h-[180px] w-[200px] " />
          <Skeleton className="h-[180px] w-[200px] " />
        </>
      )}
      {productByIdQuery.data?.variants?.map((variant) => (
        <div
          key={variant.id}
          className="divide-y divide-slate-200 rounded-lg border border-b shadow-sm"
        >
          <div className="space-y-4 p-6">
            <div className="space-y-2">
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
            </div>
            <Button
              disabled={createCheckoutForVariantMutation.isPending}
              onClick={() => {
                if (storeId) {
                  createCheckoutForVariantMutation.mutate(
                    {
                      variantId: variant.id,
                      embed,
                    },
                    {
                      onSuccess: (checkout) => {
                        const checkoutUrl = checkout.data?.data.attributes.url;

                        embed
                          ? checkoutUrl &&
                            window.LemonSqueezy.Url.Open(checkoutUrl)
                          : router.push(checkoutUrl ?? "/");
                      },
                    },
                  );
                }
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
  );
};

export default Subscriptions;
