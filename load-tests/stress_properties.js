import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "20s", target: 0 },
  ],
};

export default function () {
  const res = http.get("http://localhost:8000/properties");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}