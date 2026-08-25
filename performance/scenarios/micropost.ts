// 実行:
// k6 run performance/scenarios/micropost.ts

import http from "k6/http";
import { check } from "k6";

const BASE_URL = "http://localhost:3000";

export const options = {
  noCookiesReset: true,
  scenarios: {
    microposts: {
      executor: "per-vu-iterations",
      vus: 5,
      iterations: 5,
      maxDuration: "1m",
    },
  },
};

let loggedIn = false;

export default function micropostTest() {
  const USER_NUMBER_OFFSET = 10;
  // 既存の負荷試験データと重複しないユーザーをVUごとに割り当てる。
  const userNumber = __VU + USER_NUMBER_OFFSET;
  const email = `performance-user-${userNumber}@example.com`;

  if (!loggedIn) {
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

    loggedIn = true;
  }

  const micropostResponse = http.post(`${BASE_URL}/api/microposts`, {
    content: `k6 micropost user-${userNumber} iteration-${__ITER}`,
  });

  check(micropostResponse, {
    "micropost status is 201": (response) => response.status === 201,
  });
}
