// load-tests/helpers.js

import http from "k6/http";
import { check } from "k6";

import { BASE_URL } from "./users.js";
import { generateListing, generateProperty } from "./data.js";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

function authHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

/* ============================================================
 * AUTH
 * ============================================================
 */

function parseToken(response) {
  return response.json("access_token");
}

export function login(credentials) {
  const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify(credentials), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(res, {
    "login succeeded": (r) => r.status === 200,
  });

  if (res.status !== 200) {
    return null;
  }

  return parseToken(res);
}

export function getCurrentUser(token) {
  const res = http.get(`${BASE_URL}/auth/me`, authHeaders(token));

  console.log("AUTH ME STATUS:", res.status, "BODY:", res.body);

  check(res, {
    "get current user": (r) => r.status === 200,
  });

  if (res.status !== 200) {
    return null;
  }

  return res.json();
}

/* ============================================================
 * LISTINGS
 * ============================================================
 */

export function getListings(token) {
  const res = http.get(`${BASE_URL}/listings/`, authHeaders(token));

  check(res, {
    "get listings": (r) => r.status === 200,
  });

  if (res.status !== 200) {
    return [];
  }

  return res.json();
}

export function getRandomListing(token) {
  const listings = getListings(token);

  if (!listings.length) {
    return null;
  }

  return listings[Math.floor(Math.random() * listings.length)];
}

/* ============================================================
 * PROPERTIES
 * ============================================================
 */

export function createProperty(token) {
  const payload = generateProperty();

  const res = http.post(
    `${BASE_URL}/properties/`,
    JSON.stringify(payload),
    authHeaders(token),
  );

  check(res, {
    "property created": (r) => r.status === 201,
  });

  if (res.status !== 201) {
    return null;
  }

  return res.json();
}

/* ============================================================
 * CREATE LISTING
 * ============================================================
 */

export function createListing(token, propertyId) {
  const payload = generateListing(propertyId);

  const res = http.post(
    `${BASE_URL}/listings/`,
    JSON.stringify(payload),
    authHeaders(token),
  );

  check(res, {
    "listing created": (r) => r.status === 201,
  });

  if (res.status !== 201) {
    return null;
  }

  return res.json();
}

/* ============================================================
 * FAVORITES
 * ============================================================
 */

export function addFavorite(token, clientId, listingId) {
  const res = http.post(
    `${BASE_URL}/clients/${clientId}/favorites/${listingId}`,
    null,
    authHeaders(token),
  );

  check(res, {
    "favorite added": (r) => r.status === 200,
  });

  return res;
}

export function removeFavorite(token, clientId, listingId) {
  const res = http.del(
    `${BASE_URL}/clients/${clientId}/favorites/${listingId}`,
    null,
    authHeaders(token),
  );

  check(res, {
    "favorite removed": (r) => r.status === 200,
  });

  return res;
}

/* ============================================================
 * PURCHASE
 * ============================================================
 */

export function purchaseListing(token, listingId) {
  const res = http.post(
    `${BASE_URL}/listings/${listingId}/purchase`,
    null,
    authHeaders(token),
  );

  check(res, {
    purchase: (r) => r.status === 200 || r.status === 400 || r.status === 409,
  });

  return res;
}

export function randomSleep(min = 1, max = 3) {
  return Math.random() * (max - min) + min;
}
