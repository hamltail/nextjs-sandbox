import type { SandboxExperiment } from "@/lib/sandbox/sandbox.types";

export const sandboxExperiments: SandboxExperiment[] = [
  {
    slug: "state-management",
    title: "State Management",
    description: "useStateとRedux Toolkitによる状態管理の違いを比較します。",
    tags: ["React", "TypeScript", "Redux"],
    access: "public",
  },
  {
    slug: "api-communication",
    title: "API Communication",
    description: "モダンなバックエンドAPIとの通信を試します。",
    tags: ["Next.js", "API"],
    access: "public",
  },
];
