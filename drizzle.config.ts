import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({path: '.env.local'});

// console.log('DATABASE_URL:', process.env.DATABASE_URL); // to verify if the DATABASE_URL is set

export default defineConfig({
  out: './drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

// npx drizzle-kit push:pg