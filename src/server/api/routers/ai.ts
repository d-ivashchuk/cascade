import { z } from "zod";
import { openai } from "~/lib/openai";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const actionableStepSchema = z.object({
  name: z.string(),
  description: z.string().max(200),
});

const launchPlanArgsSchema = z.object({
  productName: z.string(),
  productDescription: z.string(),
  actionableSteps: z.array(actionableStepSchema),
});

export const aiRouter = createTRPCRouter({
  generateProjectPlan: protectedProcedure
    .input(
      z.object({ projectName: z.string(), projectDescription: z.string() }),
    )
    .mutation(async ({ input }) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "you are an AI specialised in creating plans for launching SaaS projects. Generate a comprehensive plan detailing the steps necessary for a successful launch, including market analysis, target audience identification, marketing strategies, and development roadmap.",
          },
          {
            role: "user",
            content: `I'm planning to launch a new SaaS called "${input.projectName}". It's described as "${input.projectDescription}". Based on this, could you help me formulate a detailed launch plan?`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generateSaaSPlan",
              description:
                "Generates a comprehensive plan for launching a SaaS project",
              parameters: {
                type: "object",
                properties: {
                  productName: {
                    type: "string",
                    description: "Name of the SaaS product",
                  },
                  productDescription: {
                    type: "string",
                    description: "A brief description of the SaaS product",
                  },
                  actionableSteps: {
                    type: "array",
                    description:
                      "A list of actionable steps to take during the launch process",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                          description:
                            "A short, descriptive name for the actionable step",
                        },
                        description: {
                          type: "string",
                          description:
                            "A detailed description of the actionable step. Maximum length is 200 characters. Make it relatable to the target audience and concrete.",
                        },
                      },
                    },
                  },
                },
                required: [
                  "productName",
                  "productDescription",
                  "actionableSteps",
                ],
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: {
            name: "generateSaaSPlan",
          },
        },
        temperature: 0.9,
      });

      const launchPlanArgs =
        completion.choices?.[0]?.message?.tool_calls?.[0]?.function.arguments;
      // Parsing the launch plan arguments using Zod
      const parsedLaunchPlanArgs = launchPlanArgs
        ? launchPlanArgsSchema.parse(JSON.parse(launchPlanArgs))
        : null;

      return parsedLaunchPlanArgs;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
