import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SandboxCard from "./SandboxCard";

const meta = {
  title: "Components/Sandbox/SandboxCard",
  component: SandboxCard,
} satisfies Meta<typeof SandboxCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Public: Story = {
  args: {
    experiment: {
      slug: "state-management",
      title: "State Management",
      description: "useStateとRedux Toolkitによる状態管理の違いを比較します。",
      tags: ["React", "TypeScript", "Redux"],
      access: "public",
    },
  },
};

export const Authenticated: Story = {
  args: {
    experiment: {
      slug: "authenticated-example",
      title: "Authenticated Example",
      description: "ログインユーザーのみ利用できる実験です。",
      tags: ["Next.js", "Auth"],
      access: "authenticated",
    },
  },
};

export const Admin: Story = {
  args: {
    experiment: {
      slug: "ai-chat",
      title: "AI Chat",
      description: "管理者のみ利用できる外部API連携の実験です。",
      tags: ["AI", "API"],
      access: "admin",
    },
  },
};
