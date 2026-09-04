export type SandboxAccess = "public" | "authenticated" | "admin";

export type SandboxExperiment = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  access: SandboxAccess;
};
