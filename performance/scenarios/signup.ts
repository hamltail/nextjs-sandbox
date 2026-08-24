// 実行: k6 run performance/scenarios/signup.ts

import http from "k6/http";
import { check } from "k6";

import type { CreateUserInput } from "../../lib/users/validation";

export const options = {
  vus: 5,
  iterations: 5,
};

export default function signupTest() {
  const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;

  const body: CreateUserInput = {
    name: `k6-user-${uniqueId}`,
    email: `k6-${uniqueId}@hamltail.dev`,
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
