// 実行:
// k6 run performance/scenarios/micropost.ts

import http from "k6/http";
import { check } from "k6";

const BASE_URL = "http://localhost:3000";
const USERS_PER_VU = 5;

export const options = {
  scenarios: {
    microposts: {
      executor: "per-vu-iterations",
      vus: 20,
      iterations: 5,
      maxDuration: "2m",
    },
  },
};

export default function micropostTest() {
  const userOffset = (__VU - 1) * USERS_PER_VU;
  const userNumber = userOffset + __ITER + 1;

  const email = `performance-user-${userNumber}@example.com`;

  const loginResponse = http.post(
    `${BASE_URL}/api/session`,
    JSON.stringify({
      email,
      password: "password",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  check(loginResponse, {
    "login status is 200": (response) => response.status === 200,
  });

  for (let postNumber = 1; postNumber <= 5; postNumber++) {
    const micropostResponse = http.post(`${BASE_URL}/api/microposts`, {
      content: `k6 micropost user-${userNumber} post-${postNumber}`,
    });

    check(micropostResponse, {
      "micropost status is 201": (response) => response.status === 201,
    });
  }
}
