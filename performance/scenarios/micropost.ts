// 実行:
// k6 run performance/scenarios/micropost.ts

import http from "k6/http";
import { check } from "k6";

const BASE_URL = "http://localhost:3000";

export default function micropostTest() {
  const loginResponse = http.post(
    `${BASE_URL}/api/session`,
    JSON.stringify({
      email: "performance-user-1@example.com",
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

  const micropostResponse = http.post(`${BASE_URL}/api/microposts`, {
    content: `k6 micropost ${Date.now()}`,
  });

  check(micropostResponse, {
    "micropost status is 201": (response) => response.status === 201,
  });
}
