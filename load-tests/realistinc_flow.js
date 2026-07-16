// load-tests/realistic_flow.js

import { sleep } from "k6";
import { Trend } from "k6/metrics";
import exec from "k6/execution";

import {
  login,
  getCurrentUser,
  getListings,
  getRandomListing,
  createProperty,
  createListing,
  purchaseListing,
  addFavorite,
  randomSleep,
} from "./helpers.js";

import { getClient, getRealEstate } from "./users.js";

// ======================================================
// CONFIGURATION
// ======================================================

export const options = {
  scenarios: {
    clients: {
      executor: "constant-vus",
      exec: "clientScenario",
      vus: 20,
      duration: "2m",
    },

    realEstates: {
      executor: "constant-vus",
      exec: "realEstateScenario",
      vus: 5,
      duration: "2m",
    },
  },
};

// ======================================================
// METRICS
// ======================================================

const listingsTrend = new Trend("listings_duration");
const createPropertyTrend = new Trend("create_property_duration");
const createListingTrend = new Trend("create_listing_duration");
const purchaseTrend = new Trend("purchase_duration");

// ======================================================
// SESSIONS
// ======================================================

const sessions = {};

function getSession() {
  const vuId = exec.vu.idInInstance;

  return sessions[vuId];
}

function setSession(value) {
  const vuId = exec.vu.idInInstance;

  sessions[vuId] = value;
}

// ======================================================
// CLIENTS
// ======================================================

export function clientScenario() {
  let session = getSession();

  if (!session) {
    const credentials = getClient(exec.vu.idInTest);

    const token = login(credentials);

    if (!token) {
      return;
    }

    const currentUser = getCurrentUser(token);

    if (!currentUser) {
      return;
    }

    session = {
      token,
      user: currentUser,
    };

    setSession(session);
  }

  const start = Date.now();

  const listing = getRandomListing(session.token);

  listingsTrend.add(Date.now() - start);

  if (!listing) {
    sleep(randomSleep());
    return;
  }

  const random = Math.random();

  // 60% solamente navegar

  if (random < 0.6) {
    sleep(randomSleep());

    return;
  }

  // 20% favoritos

  if (random < 0.8) {
    addFavorite(session.token, session.user.id, listing.id);

    sleep(randomSleep());

    return;
  }

  // 20% compra

  const purchaseStart = Date.now();

  purchaseListing(session.token, listing.id);

  purchaseTrend.add(Date.now() - purchaseStart);

  sleep(randomSleep());
}

// ======================================================
// REAL ESTATES
// ======================================================

export function realEstateScenario() {
  let session = getSession();

  if (!session) {
    const credentials = getRealEstate(exec.vu.idInTest);

    const token = login(credentials);

    if (!token) {
      return;
    }

    const currentUser = getCurrentUser(token);

    if (!currentUser) {
      return;
    }
    
    session = {
      token,
      user: currentUser,
    };

    setSession(session);
  }

  // 70% solamente consultar publicaciones

  if (Math.random() < 0.7) {
    const start = Date.now();

    getListings(session.token);

    listingsTrend.add(Date.now() - start);

    sleep(randomSleep(2, 4));

    return;
  }

  // 30% crear propiedad + publicación

  const propertyStart = Date.now();

  const property = createProperty(session.token);

  createPropertyTrend.add(Date.now() - propertyStart);

  if (!property) {
    sleep(randomSleep(2, 4));

    return;
  }

  const listingStart = Date.now();

  createListing(session.token, property.id);

  createListingTrend.add(Date.now() - listingStart);

  sleep(randomSleep(2, 4));
}
