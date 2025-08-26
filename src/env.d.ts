declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_DB_URL: string;
    JWT_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
    CLOUDINARY_CLOUDE_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    ADMIN_ID: string;
    ALLOWED_ORIGIN: string;
  }
}
