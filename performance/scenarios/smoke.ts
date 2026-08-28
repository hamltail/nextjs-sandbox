// 実行: k6 run performance/scenarios/smoke.ts

import { check } from "k6";
import http from "k6/http";

export default function smokeTest() {
  const response = http.get("http://localhost:3000");

  check(response, {
    "status is 200": (response) => response.status === 200,
  });
}
