import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 50,
  duration: "30s",
};

export default function () {
  const res = http.get("http://localhost:8000/properties");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has response": (r) => r.body.length > 0,
  });

  sleep(1);
}