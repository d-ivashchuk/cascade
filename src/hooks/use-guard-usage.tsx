import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

const CREDITS_WITHOUT_SUBSCRIPTION = 5;

const useGuardedSpendCredits = (
  feature: "buttonClicks" | "aiCalls" | "fileUploads",
) => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const utils = api.useUtils();

  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    api.paymentManagement.getSubscriptionByUserId.useQuery();
  const { data: usageData, isLoading: isLoadingUsage } =
    api.paymentManagement.getUsageForUser.useQuery({ feature });
  const spendCreditsMutation = api.paymentManagement.spendCredits.useMutation({
    onSuccess: () => {
      toast.success("Credits spent successfully");
    },
  });

  const availableCredits =
    (subscriptionData?.plan?.[feature] as number) ??
    CREDITS_WITHOUT_SUBSCRIPTION;
  // Dynamically calculate credits left based on the feature
  const featureCreditsLeft = useMemo(() => {
    const spentCredits = usageData?.totalUsageForFeatureThisMonth ?? 0;

    return availableCredits - spentCredits;
  }, [usageData, availableCredits]);

  const hasRunOutOfCredits = useMemo(
    () => featureCreditsLeft < 1,
    [featureCreditsLeft],
  );

  const guardAndSpendCredits = useCallback(
    async (spendAmount: number) => {
      if (
        isLoadingSubscription ||
        isLoadingUsage ||
        spendCreditsMutation.isPending
      )
        return;

      if (!hasRunOutOfCredits) {
        try {
          await spendCreditsMutation.mutateAsync({
            amount: spendAmount,
            feature,
          });
          await utils.paymentManagement.getUsageForUser.invalidate({
            feature,
          });
        } catch (error) {
          toast.error("Failed to spend credits");
        }
      } else {
        setShowUpgradeDialog(true);
        return { hasRunOutOfCredits };
      }
    },
    [
      isLoadingSubscription,
      isLoadingUsage,
      hasRunOutOfCredits,
      spendCreditsMutation,
      utils,
      feature,
    ],
  );

  return {
    guardAndSpendCredits,
    showUpgradeDialog,
    setShowUpgradeDialog,
    isPending: spendCreditsMutation.isPending,
    hasRunOutOfCredits,
    featureCreditsLeft,
    availableCredits,
  };
};

export default useGuardedSpendCredits;
