// load-tests/data.js

const STREETS = [
  "San Martín",
  "Belgrano",
  "Mitre",
  "Rivadavia",
  "Sarmiento",
  "Brown",
  "Alvear",
  "Lavalle",
  "Moreno",
  "Perón",
  "Italia",
  "España",
  "Libertad",
  "Independencia",
  "Colón",
];

const CITIES = [
  "Quilmes",
  "Avellaneda",
  "Lanús",
  "Lomas de Zamora",
  "Berazategui",
  "Florencio Varela",
  "La Plata",
  "Banfield",
  "Temperley",
  "Adrogué",
];

const PROPERTY_TYPES = [
  "house",
  "apartment",
];

const CHARACTERISTICS = [
  "2 bedrooms, 1 bathroom",
  "3 bedrooms, 2 bathrooms",
  "Garage and patio",
  "Excellent natural lighting",
  "Recently renovated",
  "Large backyard",
  "Swimming pool",
  "Barbecue area",
  "Near downtown",
  "Quiet neighborhood",
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomAddress() {
  return `${randomItem(STREETS)} ${randomNumber(100, 9999)}`;
}

function randomPrice() {
  return randomNumber(50000, 500000);
}

function randomStatus() {
  return "active";
}

/**
 * Generates a random property payload.
 */
export function generateProperty() {
  return {
    address: randomAddress(),
    location: randomItem(CITIES),
    type: randomItem(PROPERTY_TYPES),
    characteristics: randomItem(CHARACTERISTICS),
  };
}

/**
 * Generates a listing payload.
 * propertyId must be the id returned by POST /properties.
 */
export function generateListing(propertyId) {
  return {
    property_id: propertyId,
    price: randomPrice(),
    status: randomStatus(),
  };
}