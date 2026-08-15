import { createHash, randomUUID } from "node:crypto";

export function createActivationToken() {
  return randomUUID();
}

export function hashActivationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
