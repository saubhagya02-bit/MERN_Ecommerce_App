export const ROLES = {
  USER: 0,
  ADMIN: 1,
};

// Price filter ranges
export const PRICE_RANGES = [
  { _id: 0, name: "$0 – $19", array: [0, 19] },
  { _id: 1, name: "$20 – $39", array: [20, 39] },
  { _id: 2, name: "$40 – $59", array: [40, 59] },
  { _id: 3, name: "$60 – $79", array: [60, 79] },
  { _id: 4, name: "$80 – $99", array: [80, 99] },
  { _id: 5, name: "$100+", array: [100, 9999] },
];

//  Order statuses
export const ORDER_STATUSES = [
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

//  Photo size limit
export const MAX_PHOTO_SIZE_MB = 1;
export const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
