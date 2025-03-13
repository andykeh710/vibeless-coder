import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAutomationSettingsSchema, insertMessageTemplateSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get automation settings
  app.get("/api/automation-settings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      let settings = await storage.getAutomationSettings(userId);
      
      // If no settings exist, create default settings
      if (!settings) {
        settings = await storage.createAutomationSettings({
          userId,
          enabled: false,
          interval: 5000,
          messageText: "Help me optimize this function for better performance.",
          showNotifications: true,
          playSound: false,
          handleMultiCursor: true,
          cursorBehavior: "stay"
        });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get automation settings" });
    }
  });
  
  // Update automation settings
  app.put("/api/automation-settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid settings ID" });
      }
      
      const existingSettings = await storage.getAutomationSettings(id);
      if (!existingSettings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      
      const updatedSettings = await storage.updateAutomationSettings(id, req.body);
      if (!updatedSettings) {
        return res.status(404).json({ message: "Failed to update settings" });
      }
      
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update automation settings" });
    }
  });
  
  // Get message templates for user
  app.get("/api/message-templates/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const templates = await storage.getMessageTemplates(userId);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to get message templates" });
    }
  });
  
  // Create new message template
  app.post("/api/message-templates", async (req, res) => {
    try {
      const templateData = insertMessageTemplateSchema.parse(req.body);
      const template = await storage.createMessageTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create message template" });
    }
  });
  
  // Update message template
  app.put("/api/message-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const existingTemplate = await storage.getMessageTemplate(id);
      if (!existingTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      const updatedTemplate = await storage.updateMessageTemplate(id, req.body);
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Failed to update template" });
      }
      
      res.json(updatedTemplate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update message template" });
    }
  });
  
  // Delete message template
  app.delete("/api/message-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const success = await storage.deleteMessageTemplate(id);
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
