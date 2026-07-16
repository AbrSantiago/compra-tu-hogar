import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "30s",
};

export default function () {
  // 1. Login
  const loginRes = http.post(
    "http://localhost:8000/auth/login",
    JSON.stringify({
      email: "test@test.com",
      password: "123456",
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  const token = loginRes.json("access_token");

  if (!token) return;

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // 2. Get properties
  const props = http.get("http://localhost:8000/properties", authHeaders);

  const first = props.json()[0];

  if (!first) return;

  // 3. Purchase
  const purchase = http.post(
    "http://localhost:8000/purchases",
    JSON.stringify({ property_id: first.id }),
    authHeaders
  );

  check(purchase, {
    "purchase ok": (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}