function requireEnv(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
}

export const MONGO_DB_URL = requireEnv("MONGO_DB_URL");
export const JWT_SECRET = requireEnv("JWT_SECRET");
export const NODE_ENV = requireEnv("NODE_ENV");
export const CLOUDINARY_CLOUDE_NAME = requireEnv("CLOUDINARY_CLOUDE_NAME");
export const CLOUDINARY_API_KEY = requireEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = requireEnv("CLOUDINARY_API_SECRET");
export const ADMIN_ID = requireEnv("ADMIN_ID");
export const ALLOWED_ORIGIN = requireEnv("ALLOWED_ORIGIN");
