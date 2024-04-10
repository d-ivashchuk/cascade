"use client";
import { Separator } from "~/components/ui/separator";
import { Loader2 } from "lucide-react";
import React from "react";
import { UpgradeDialog } from "~/components/patterns/upgrade-dialog";
import { Button } from "~/components/ui/button";
import useGuardedSpendCredits from "~/hooks/use-guard-usage";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";

const Usage = () => {
  const guardedUsage = useGuardedSpendCredits("buttonClicks");
  const getUsageForUserQuery = api.paymentManagement.getUsageForUser.useQuery({
    feature: "buttonClicks",
  });

  const getSubscriptionForUserQuery =
    api.paymentManagement.getSubscriptionByUserId.useQuery();

  const plan = getSubscriptionForUserQuery.data?.plan;

  return (
    <div>
      <div>
        <h1 className="mb-2 text-2xl">Usage</h1>
        <h2 className="text-md text-muted-foreground">
          On this screen you can see the usage of the credits. After you set up
          your plans via{" "}
          <Link className="underline" href="/ls-setup">
            Lemon Squeezy setup page
          </Link>{" "}
          you need to modify the credits directly in the database.
        </h2>
      </div>
      <Separator className="my-4" />
      {getUsageForUserQuery.isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[20px] max-w-md" />
          <Skeleton className="h-[20px] max-w-md" />
          <Skeleton className="h-[20px] max-w-md" />
        </div>
      )}
      {getUsageForUserQuery.data && (
        <div className="mb-4">
          <p>
            Monthly credits available: <b>{plan?.buttonClicks ?? 50}</b>
          </p>
          <p>
            Credits spent today:{" "}
            <b>{getUsageForUserQuery.data?.totalUsageForFeatureThisDay}</b>
          </p>
          <p>
            Credits spent this month:{" "}
            <b> {getUsageForUserQuery.data?.totalUsageForFeatureThisMonth}</b>
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => guardedUsage.guardAndSpendCredits(1)}
          disabled={guardedUsage.isPending}
        >
          {guardedUsage.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {guardedUsage.hasRunOutOfCredits
            ? "Upgrade to spend 1 credit"
            : "Spend 1 credit"}
        </Button>
        <Button
          onClick={() => guardedUsage.guardAndSpendCredits(5)}
          disabled={guardedUsage.isPending}
        >
          {guardedUsage.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {guardedUsage.hasRunOutOfCredits
            ? "Upgrade to spend 5 credits"
            : "Spend 5 credits"}
        </Button>
        <Button
          onClick={() => guardedUsage.guardAndSpendCredits(10)}
          disabled={guardedUsage.isPending}
        >
          {guardedUsage.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {guardedUsage.hasRunOutOfCredits
            ? "Upgrade to spend 10 credits"
            : "Spend 10 credits"}
        </Button>
      </div>
      <UpgradeDialog
        open={guardedUsage.showUpgradeDialog}
        setOpen={guardedUsage.setShowUpgradeDialog}
      />
    </div>
  );
};

export default Usage;
