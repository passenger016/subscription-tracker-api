import { config } from "dotenv";

// Load environment variables from .env file
// if it is prodcution then it will load the node environment using process.env.NODE_ENV from .env.production.local
// if not it will default to development and load .env.development.local

// NODE_ENV is definted in the /.env.production.local file
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    NODE_ENV, PORT, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_ENV, ARCJET_KEY, QSTASH_URL, QSTASH_TOKEN, SERVER_URL
} = process.env;