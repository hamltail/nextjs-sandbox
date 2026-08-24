// 実行:
// K6_EMAIL_DOMAIN=<your-domain> k6 run performance/scenarios/signup.ts

import http from "k6/http";
import { check } from "k6";

import type { CreateUserInput } from "../../lib/users/validation";

// ユーザー登録時にResend APIでアクティベーションメールを送信するため、
// 外部サービスへの過剰な負荷やレート制限を避ける目的で負荷を抑えている。
export const options = {
  vus: 5,
  iterations: 5,
};

const emailDomain = __ENV.K6_EMAIL_DOMAIN;

if (!emailDomain) {
  throw new Error("K6_EMAIL_DOMAIN is required");
}

export default function signupTest() {
  const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;

  const body: CreateUserInput = {
    name: `k6-user-${uniqueId}`,
    email: `k6-${uniqueId}@${emailDomain}`,
    password: "password123",
    passwordConfirmation: "password123",
  };

  const response = http.post(
    "http://localhost:3000/api/users",
    JSON.stringify(body),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  check(response, {
    "status is 201": (response) => response.status === 201,
  });
}
