import { createHash, randomUUID } from "node:crypto";

export function createResetToken() {
  return randomUUID();
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
