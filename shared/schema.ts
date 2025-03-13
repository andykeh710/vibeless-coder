import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const automationSettings = pgTable("automation_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  enabled: boolean("enabled").notNull().default(false),
  interval: integer("interval").notNull().default(5000),
  messageText: text("message_text").notNull().default("Help me optimize this function for better performance."),
  showNotifications: boolean("show_notifications").notNull().default(true),
  playSound: boolean("play_sound").notNull().default(false),
  handleMultiCursor: boolean("handle_multi_cursor").notNull().default(true),
  cursorBehavior: text("cursor_behavior").notNull().default("stay"),
});

export const messageTemplates = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  content: text("content").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAutomationSettingsSchema = createInsertSchema(automationSettings).omit({
  id: true
});

export const insertMessageTemplateSchema = createInsertSchema(messageTemplates).omit({
  id: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAutomationSettings = z.infer<typeof insertAutomationSettingsSchema>;
export type AutomationSettings = typeof automationSettings.$inferSelect;

export type InsertMessageTemplate = z.infer<typeof insertMessageTemplateSchema>;
export type MessageTemplate = typeof messageTemplates.$inferSelect;
