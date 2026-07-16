import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "20s",
};

export default function () {
  const payload = JSON.stringify({
    email: "test@test.com",
    password: "123456",
  });

  const headers = {
    "Content-Type": "application/json",
  };

  const res = http.post("http://localhost:8000/auth/login", payload, { headers });

  check(res, {
    "login status 200 or 401": (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);
}