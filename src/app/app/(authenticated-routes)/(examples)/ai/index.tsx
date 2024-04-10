"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { CheckCheck, Loader2 } from "lucide-react";
import { Card } from "~/components/ui/card";
import useGuardedSpendCredits from "~/hooks/use-guard-usage";
import { toast } from "sonner";

const formSchema = z.object({
  projectName: z.string().min(5, {
    message: "Project name must be at least 5 characters.",
  }),
  projectDescription: z.string().min(20, {
    message: "Description must be at least 5 characters.",
  }),
});

const AiProjectPlanner = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
    },
  });

  const generatePlanMutation = api.ai.generateProjectPlan.useMutation();
  const guardedUsage = useGuardedSpendCredits("aiCalls");
  const getUsageForUserQuery = api.paymentManagement.getUsageForUser.useQuery({
    feature: "aiCalls",
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await guardedUsage.guardAndSpendCredits(1);
    if (result?.hasRunOutOfCredits) {
      toast.error("You ran out of credits");
      return;
    }
    generatePlanMutation.mutate(values);
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl">Generate SaaS launch plan</h2>
        <p className="text-md text-muted-foreground">
          This example uses OpenAI API, so calls are limited unless you provide
          your own API key
        </p>
        <p className="text-md font-bold text-muted-foreground">
          You have spent{" "}
          {getUsageForUserQuery.data?.totalUsageForFeatureThisMonth} credits
          from {guardedUsage.availableCredits}
        </p>
      </div>

      <div className="flex max-w-[1024px] flex-col gap-4 md:flex-row">
        <Card className="w-full px-4 py-8 md:w-1/2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cascade SaaS boilerplate"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your project name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cascade helps entrepreneurs build SaaS products faster. It is open-source and free to use."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What problem does your SaaS solve
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={
                  generatePlanMutation.isPending ||
                  guardedUsage.hasRunOutOfCredits
                }
              >
                {generatePlanMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {guardedUsage.hasRunOutOfCredits
                  ? "You ran out of credits"
                  : "Generate SaaS plan"}
              </Button>
            </form>
          </Form>
        </Card>
        <div className="flex w-full flex-1 flex-col gap-4 md:items-start">
          {generatePlanMutation.data && (
            <Card className="h-full w-full px-2 py-4 ">
              <div>
                {generatePlanMutation.data.actionableSteps.map(
                  (step, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 self-center"
                    >
                      <div className="mb-2 flex-col">
                        <div className="flex-1 text-lg">{step.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {step.description}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCheck className="h-4 w-4" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiProjectPlanner;
