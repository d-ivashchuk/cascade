import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react"; // Assuming TRPC's React Query hooks usage

const CREDITS_WITHOUT_SUBSCRIPTION = 50;

const useGuardedSpendCredits = () => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const utils = api.useUtils();

  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    api.ls.getSubscriptionByUserId.useQuery();
  const { data: usageData, isLoading: isLoadingUsage } =
    api.ls.getUsageForUser.useQuery();
  const spendCreditsMutation = api.ls.spendCredits.useMutation({
    onSuccess: () => {
      toast.success("Credits spent successfully");
    },
  });

  // Calculate whether the user has run out of credits
  const hasRunOutOfCredits = useMemo(() => {
    const availableCredits =
      subscriptionData?.plan?.credits ?? CREDITS_WITHOUT_SUBSCRIPTION;
    const spentCredits = usageData?.totalButtonClicksThisMonth ?? 0;
    const creditsLeft = availableCredits - spentCredits;
    return creditsLeft < 1; // Adjust logic based on when you consider credits "run out"
  }, [subscriptionData, usageData]);

  const guardAndSpendCredits = useCallback(
    async (spendAmount: number) => {
      if (
        isLoadingSubscription ||
        isLoadingUsage ||
        spendCreditsMutation.isPending
      )
        return;

      // Utilize the memoized hasRunOutOfCredits value to determine action
      if (!hasRunOutOfCredits) {
        try {
          await spendCreditsMutation.mutateAsync({ amount: spendAmount });
          await utils.ls.getUsageForUser.invalidate();
        } catch (error) {
          toast.error("Failed to spend credits");
        }
      } else {
        setShowUpgradeDialog(true);
      }
    },
    [
      isLoadingSubscription,
      isLoadingUsage,
      spendCreditsMutation.isPending,
      hasRunOutOfCredits,
      spendCreditsMutation,
      utils,
    ],
  );

  return {
    guardAndSpendCredits,
    showUpgradeDialog,
    setShowUpgradeDialog,
    isPending: spendCreditsMutation.isPending,
    hasRunOutOfCredits,
  };
};

export default useGuardedSpendCredits;
