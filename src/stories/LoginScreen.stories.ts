import type { Meta, StoryObj } from "@storybook/react";
import { LoginScreen } from "~/components/patterns/login-screen";

const meta = {
  title: "Example/Login Screen",
  component: LoginScreen,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoginScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginScreenStory: Story = {};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testin
