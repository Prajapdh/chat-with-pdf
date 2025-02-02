import { pgTable, pgEnum, integer, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user']);

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', {length: 256}).notNull(),
    fileKey: text('file_key').notNull(),
});

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(()=>chats.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const userSubscriptions = pgTable("user_subscriptions", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull().unique(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
      .notNull()
      .unique(),
    stripeSubscriptionId: varchar("stripe_subscription_id", {
      length: 256,
    }).unique(),
    stripePriceId: varchar("stripe_price_id", { length: 256 }),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
  });

export const userUploads = pgTable("user_uploads", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull().unique(),
  uploadCount: integer("upload_count").notNull().default(0),
  lastResetDate: timestamp("last_reset_date").notNull().defaultNow(),
});
  

// to push the updated schema to the database, run the following command: npx drizzle-kit push