// load-tests/users.js

export const BASE_URL = "http://localhost:8000";

export const CLIENT_PASSWORD = "123456";
export const REAL_ESTATE_PASSWORD = "123456";

export const CLIENTS = [
  {
    email: "ana@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "juan@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "luis@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "jose@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "mara@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "leo@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "luca@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "eva@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "tomi@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "nico@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "sofi@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "lara@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "dani@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "noe@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "pablo@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "mili@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "cami@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "gabi@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "ivan@test.com",
    password: CLIENT_PASSWORD,
  },
  {
    email: "emma@test.com",
    password: CLIENT_PASSWORD,
  },
];

export const REAL_ESTATES = [
  {
    email: "remax@test.com",
    password: REAL_ESTATE_PASSWORD,
  },
  {
    email: "century@test.com",
    password: REAL_ESTATE_PASSWORD,
  },
  {
    email: "nativa@test.com",
    password: REAL_ESTATE_PASSWORD,
  },
  {
    email: "delta@test.com",
    password: REAL_ESTATE_PASSWORD,
  },
  {
    email: "sur@test.com",
    password: REAL_ESTATE_PASSWORD,
  },
];

/**
 * Returns a client based on the VU number.
 * This distributes users across VUs instead of everyone
 * logging in with the same account.
 */
export function getClient(vu) {
  return CLIENTS[(vu - 1) % CLIENTS.length];
}

/**
 * Returns a real estate based on the VU number.
 */
export function getRealEstate(vu) {
  return REAL_ESTATES[(vu - 1) % REAL_ESTATES.length];
}