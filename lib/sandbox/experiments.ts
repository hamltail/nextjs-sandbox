import type { SandboxExperiment } from "@/lib/sandbox/sandbox.types";

export const sandboxExperiments: SandboxExperiment[] = [
  {
    slug: "3d",
    title: "3D",
    description: "React Three Fiberを使った3D表現を試す。",
    tags: ["React", "Three.js", "R3F"],
    access: "public",
  },
  {
    slug: "state-management",
    title: "State Management",
    description: "Redux Toolkitによる状態管理を試す。",
    tags: ["React", "TypeScript", "Redux"],
    access: "public",
  },
  {
    slug: "api-communication",
    title: "API Communication",
    description: "APIとの通信を試す。",
    tags: ["Next.js", "API"],
    access: "public",
  },
];
