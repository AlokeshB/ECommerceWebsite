module.exports = {
  // Pagination
  ITEMS_PER_PAGE: 10,

  // JWT Configuration
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  // Upload Configuration
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],

  // API Response Defaults
  API_TIMEOUT: 30000,

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
};
