import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { Layout } from "~/components/patterns/layout";

const meta = {
  title: "Example/Page",
  component: Layout,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutStory: Story = {
  args: {
    children: "Dashboard",
  },
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testin
