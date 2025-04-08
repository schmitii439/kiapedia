import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertTopicSchema, 
  insertTopicContentSchema,
  insertGlossaryTermSchema,
  insertAiChatSchema,
  insertExpertOpinionSchema
} from "@shared/schema";
import OpenAI from "openai";

// Helper function to handle async routes
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
  (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((err) => {
      console.error("API Error:", err);
      res.status(500).json({ message: err.message || "Internal server error" });
    });
  };

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for users
  app.post('/api/users', asyncHandler(async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      throw error;
    }
  }));

  app.get('/api/users/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }));

  // API routes for topics
  app.get('/api/topics', asyncHandler(async (req, res) => {
    const topics = await storage.getTopics();
    res.json(topics);
  }));

  app.get('/api/topics/century/:century', asyncHandler(async (req, res) => {
    const century = parseInt(req.params.century);
    const topics = await storage.getTopicsByCentury(century);
    res.json(topics);
  }));

  app.get('/api/topics/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const topic = await storage.getTopic(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.json(topic);
  }));

  app.post('/api/topics', asyncHandler(async (req, res) => {
    try {
      const topicData = insertTopicSchema.parse(req.body);
      const topic = await storage.createTopic(topicData);
      res.status(201).json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      throw error;
    }
  }));

  app.put('/api/topics/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updateData = insertTopicSchema.partial().parse(req.body);
      const updatedTopic = await storage.updateTopic(id, updateData);
      if (!updatedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json(updatedTopic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      throw error;
    }
  }));

  app.delete('/api/topics/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTopic(id);
    if (!success) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.status(204).send();
  }));

  // API routes for topic contents
  app.get('/api/topic-contents/:topicId', asyncHandler(async (req, res) => {
    const topicId = parseInt(req.params.topicId);
    const content = await storage.getTopicContent(topicId);
    if (!content) {
      return res.status(404).json({ message: "Topic content not found" });
    }
    res.json(content);
  }));

  app.post('/api/topic-contents', asyncHandler(async (req, res) => {
    try {
      const contentData = insertTopicContentSchema.parse(req.body);
      const content = await storage.createTopicContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      throw error;
    }
  }));

  // API routes for related topics
  app.get('/api/related-topics/:topicId', asyncHandler(async (req, res) => {
    const topicId = parseInt(req.params.topicId);
    const relatedTopics = await storage.getRelatedTopics(topicId);
    res.json(relatedTopics);
  }));

  app.post('/api/related-topics', asyncHandler(async (req, res) => {
    const { sourceTopicId, targetTopicId } = req.body;
    
    if (!sourceTopicId || !targetTopicId) {
      return res.status(400).json({ message: "Source and target topic IDs are required" });
    }
    
    const relation = await storage.addRelatedTopic({
      sourceTopicId: parseInt(sourceTopicId),
      targetTopicId: parseInt(targetTopicId)
    });
    
    res.status(201).json(relation);
  }));

  // API routes for glossary terms
  app.get('/api/glossary', asyncHandler(async (req, res) => {
    const terms = await storage.getGlossaryTerms();
    res.json(terms);
  }));

  app.get('/api/glossary/:term', asyncHandler(async (req, res) => {
    const term = req.params.term;
    const glossaryTerm = await storage.getGlossaryTerm(term);
    if (!glossaryTerm) {
      return res.status(404).json({ message: "Term not found" });
    }
    res.json(glossaryTerm);
  }));

  app.post('/api/glossary', asyncHandler(async (req, res) => {
    try {
      const termData = insertGlossaryTermSchema.parse(req.body);
      const term = await storage.createGlossaryTerm(termData);
      res.status(201).json(term);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      throw error;
    }
  }));

  // API routes for AI chat
  app.get('/api/ai-chats/user/:userId', asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const chats = await storage.getAiChatsByUser(userId);
    res.json(chats);
  }));

  app.get('/api/ai-chats/topic/:topicId', asyncHandler(async (req, res) => {
    const topicId = parseInt(req.params.topicId);
    const chats = await storage.getAiChatsByTopic(topicId);
    res.json(chats);
  }));

  app.post('/api/ai-chats', asyncHandler(async (req, res) => {
    try {
      const chatData = insertAiChatSchema.parse(req.body);
      const chat = await storage.createAiChat(chatData);
      res.status(201).json(chat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      throw error;
    }
  }));
  
  // API route for OpenAI chat completions
  app.post('/api/openai/chat', asyncHandler(async (req, res) => {
    try {
      const { messages, systemMessage } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages are required and must be an array" });
      }
      
      // Prepare messages array for OpenAI
      const openaiMessages = [];
      
      // Add system message if provided
      if (systemMessage) {
        openaiMessages.push({ role: 'system', content: systemMessage });
      }
      
      // Add user and assistant messages
      openaiMessages.push(...messages);
      
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 1000
      });
      
      res.json({
        content: completion.choices[0].message.content,
        model: completion.model
      });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ 
        message: "Error calling OpenAI API", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }));

  // API routes for expert opinions
  app.get('/api/expert-opinions/:topicId', asyncHandler(async (req, res) => {
    const topicId = parseInt(req.params.topicId);
    const opinions = await storage.getExpertOpinionsByTopic(topicId);
    res.json(opinions);
  }));

  app.post('/api/expert-opinions', asyncHandler(async (req, res) => {
    try {
      const opinionData = insertExpertOpinionSchema.parse(req.body);
      const opinion = await storage.createExpertOpinion(opinionData);
      res.status(201).json(opinion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      throw error;
    }
  }));

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
