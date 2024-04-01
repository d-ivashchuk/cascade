"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import React from "react";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { AppWindow, Banknote, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { currency } from "~/app/(authenticated-routes)/(lemon-squeezy)/subscriptions/page";

const Billing = () => {
  const userSubscriptionQuery = api.ls.getSubscriptionByUserId.useQuery();
  const subscription = userSubscriptionQuery.data?.subscription;
  const variant = userSubscriptionQuery.data?.variant;

  return (
    <div>
      <h1 className="mb-4 text-2xl">Billing</h1>

      {userSubscriptionQuery.isLoading && (
        <Skeleton className="h-[100px] max-w-lg" />
      )}
      {userSubscriptionQuery.data ? (
        <Card className="min-h-[100px] max-w-lg p-4">
          <div className="flex justify-between">
            <h2 className="text-xl">Subscription</h2>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button size="sm">
                  <Banknote className="mr-2 h-4 w-4" /> Manage subscription
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {subscription?.customerPortalUrl && (
                  <DropdownMenuItem>
                    <Link
                      target="_blank"
                      href={subscription?.customerPortalUrl}
                    >
                      <div className="flex">
                        <AppWindow className="mr-2 h-4 w-4 self-center" />{" "}
                        Customer portal
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  {subscription?.updatePaymentMethodUrl && (
                    <Link
                      target="_blank"
                      href={subscription?.updatePaymentMethodUrl}
                    >
                      <div className="flex">
                        <CreditCard className="mr-2 h-4 w-4 self-center" />{" "}
                        Update payment method
                      </div>
                    </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {subscription?.customerPortalUpdateSubscriptionUrl && (
                    <Link
                      target="_blank"
                      href={subscription?.customerPortalUpdateSubscriptionUrl}
                    >
                      Update subscription
                    </Link>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="font-bold">
            {subscription?.name} | {variant?.data?.data.attributes.name}
          </div>
          {variant?.data?.data.attributes.price && (
            <p>
              {currency}
              {(variant?.data?.data.attributes.price / 100).toFixed(2)}
            </p>
          )}
          {subscription?.renewsAt && subscription.status !== "cancelled" && (
            <p>Renews at: {format(new Date(subscription?.renewsAt), "PP")}</p>
          )}
          {subscription?.endsAt && (
            <p>Ends at: {format(new Date(subscription?.endsAt), "PP")}</p>
          )}
          <p>Status: {subscription?.status}</p>
        </Card>
      ) : (
        <p>
          No subscription found.{" "}
          <Link className="underline" href="/subscriptions">
            Subscribe here
          </Link>{" "}
        </p>
      )}
    </div>
  );
};

export default Billing;
