"use client";
import { Loader2 } from "lucide-react";
import React from "react";
import { UpgradeDialog } from "~/components/patterns/upgrade-dialog";
import { Button } from "~/components/ui/button";
import useGuardedSpendCredits from "~/hooks/use-guard-usage";
import { api } from "~/trpc/react";

const Usage = () => {
  const guardedUsage = useGuardedSpendCredits();
  const getUsageForUserQuery = api.ls.getUsageForUser.useQuery();
  const getSubscriptionForUserQuery = api.ls.getSubscriptionByUserId.useQuery();

  const plan = getSubscriptionForUserQuery.data?.plan;

  return (
    <div>
      <h1 className="mb-4 text-2xl">Usage</h1>
      {getUsageForUserQuery.isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      {getUsageForUserQuery.data && (
        <div className="mb-4">
          <p>
            Monthly credits available: <b>{plan?.credits}</b>
          </p>
          <p>
            Credits spent today:{" "}
            <b>{getUsageForUserQuery.data?.totalButtonClicksToday}</b>
          </p>
          <p>
            Credits spent this month:{" "}
            <b> {getUsageForUserQuery.data?.totalButtonClicksThisMonth}</b>
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
