// 実Resendモード:
// K6_EMAIL_DOMAIN=<your-domain> k6 run performance/scenarios/signup.ts
//
// Mockモード:
// PERFORMANCE_TEST=true \
// K6_EMAIL_DOMAIN=example.com \
// k6 run performance/scenarios/signup.ts

import { check } from "k6";
import http from "k6/http";

import type { CreateUserInput } from "../../lib/users/validation";

const isPerformanceTest = __ENV.PERFORMANCE_TEST === "true";

const iterations = isPerformanceTest ? 100 : 5;
const vus = isPerformanceTest ? 20 : 5;

// 実Resendモードでは外部サービスへの過剰な負荷やレート制限を避けるため5件に制限する。
// Mockモードでも誤操作による大量データ生成を防ぐため、最大100件に制限する。
if (iterations > 100) {
  throw new Error("Signup performance test is limited to 100 iterations");
}

export const options = {
  vus,
  iterations,
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
