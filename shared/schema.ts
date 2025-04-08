import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  avatarUrl: true,
});

// Topic schema (conspiracy theories)
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  century: integer("century").notNull(), // 18, 19, 20, 21
  shortDescription: text("short_description"),
  firstMentionedYear: integer("first_mentioned_year"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTopicSchema = createInsertSchema(topics).pick({
  title: true,
  century: true,
  shortDescription: true,
  firstMentionedYear: true,
});

// Detailed content for topics
export const topicContents = pgTable("topic_contents", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  content: text("content").notNull(),
  aiAnalysis: text("ai_analysis"),
  factCheck: text("fact_check"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTopicContentSchema = createInsertSchema(topicContents).pick({
  topicId: true,
  content: true,
  aiAnalysis: true,
  factCheck: true,
});

// Related topics for cross-referencing
export const relatedTopics = pgTable("related_topics", {
  id: serial("id").primaryKey(),
  sourceTopicId: integer("source_topic_id").notNull(),
  targetTopicId: integer("target_topic_id").notNull(),
});

export const insertRelatedTopicSchema = createInsertSchema(relatedTopics).pick({
  sourceTopicId: true,
  targetTopicId: true,
});

// Glossary terms for hover definitions
export const glossaryTerms = pgTable("glossary_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  relatedTopicId: integer("related_topic_id"),
});

export const insertGlossaryTermSchema = createInsertSchema(glossaryTerms).pick({
  term: true,
  definition: true,
  relatedTopicId: true,
});

// AI chat history
export const aiChats = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  topicId: integer("topic_id"),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  aiProvider: text("ai_provider").notNull(), // 'openai', 'anthropic', 'perplexity'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiChatSchema = createInsertSchema(aiChats).pick({
  userId: true,
  topicId: true,
  question: true,
  answer: true,
  aiProvider: true,
});

// Expert opinions
export const expertOpinions = pgTable("expert_opinions", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  expertName: text("expert_name").notNull(),
  expertTitle: text("expert_title").notNull(),
  opinion: text("opinion").notNull(),
  avatarUrl: text("avatar_url"),
});

export const insertExpertOpinionSchema = createInsertSchema(expertOpinions).pick({
  topicId: true,
  expertName: true,
  expertTitle: true,
  opinion: true,
  avatarUrl: true,
});

// Types for database models
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type TopicContent = typeof topicContents.$inferSelect;
export type InsertTopicContent = z.infer<typeof insertTopicContentSchema>;

export type RelatedTopic = typeof relatedTopics.$inferSelect;
export type InsertRelatedTopic = z.infer<typeof insertRelatedTopicSchema>;

export type GlossaryTerm = typeof glossaryTerms.$inferSelect;
export type InsertGlossaryTerm = z.infer<typeof insertGlossaryTermSchema>;

export type AiChat = typeof aiChats.$inferSelect;
export type InsertAiChat = z.infer<typeof insertAiChatSchema>;

export type ExpertOpinion = typeof expertOpinions.$inferSelect;
export type InsertExpertOpinion = z.infer<typeof insertExpertOpinionSchema>;
