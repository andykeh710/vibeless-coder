import { users, type User, type InsertUser, automationSettings, type AutomationSettings, type InsertAutomationSettings, messageTemplates, type MessageTemplate, type InsertMessageTemplate } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAutomationSettings(userId: number): Promise<AutomationSettings | undefined>;
  createAutomationSettings(settings: InsertAutomationSettings): Promise<AutomationSettings>;
  updateAutomationSettings(id: number, settings: Partial<AutomationSettings>): Promise<AutomationSettings | undefined>;
  
  getMessageTemplates(userId: number): Promise<MessageTemplate[]>;
  getMessageTemplate(id: number): Promise<MessageTemplate | undefined>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  updateMessageTemplate(id: number, template: Partial<MessageTemplate>): Promise<MessageTemplate | undefined>;
  deleteMessageTemplate(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private automationSettings: Map<number, AutomationSettings>;
  private messageTemplates: Map<number, MessageTemplate>;
  currentUserId: number;
  currentSettingsId: number;
  currentTemplateId: number;

  constructor() {
    this.users = new Map();
    this.automationSettings = new Map();
    this.messageTemplates = new Map();
    this.currentUserId = 1;
    this.currentSettingsId = 1;
    this.currentTemplateId = 1;
    
    // Create default templates
    const defaultTemplates = [
      { userId: 1, name: "Help me understand this code", content: "Help me understand what this code is doing." },
      { userId: 1, name: "Optimize this function", content: "Help me optimize this function for better performance." },
      { userId: 1, name: "Refactor this code", content: "Refactor this code to improve readability and maintainability." },
      { userId: 1, name: "Generate unit tests", content: "Generate comprehensive unit tests for this code." },
      { userId: 1, name: "Explain this error", content: "Explain why I'm getting this error and how to fix it." }
    ];
    
    for (const template of defaultTemplates) {
      this.createMessageTemplate(template as InsertMessageTemplate);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAutomationSettings(userId: number): Promise<AutomationSettings | undefined> {
    return Array.from(this.automationSettings.values()).find(
      (settings) => settings.userId === userId,
    );
  }
  
  async createAutomationSettings(settings: InsertAutomationSettings): Promise<AutomationSettings> {
    const id = this.currentSettingsId++;
    const newSettings: AutomationSettings = { ...settings, id };
    this.automationSettings.set(id, newSettings);
    return newSettings;
  }
  
  async updateAutomationSettings(id: number, settings: Partial<AutomationSettings>): Promise<AutomationSettings | undefined> {
    const existingSettings = this.automationSettings.get(id);
    if (!existingSettings) return undefined;
    
    const updatedSettings = { ...existingSettings, ...settings };
    this.automationSettings.set(id, updatedSettings);
    return updatedSettings;
  }
  
  async getMessageTemplates(userId: number): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values()).filter(
      (template) => template.userId === userId,
    );
  }
  
  async getMessageTemplate(id: number): Promise<MessageTemplate | undefined> {
    return this.messageTemplates.get(id);
  }
  
  async createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate> {
    const id = this.currentTemplateId++;
    const newTemplate: MessageTemplate = { ...template, id };
    this.messageTemplates.set(id, newTemplate);
    return newTemplate;
  }
  
  async updateMessageTemplate(id: number, template: Partial<MessageTemplate>): Promise<MessageTemplate | undefined> {
    const existingTemplate = this.messageTemplates.get(id);
    if (!existingTemplate) return undefined;
    
    const updatedTemplate = { ...existingTemplate, ...template };
    this.messageTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }
  
  async deleteMessageTemplate(id: number): Promise<boolean> {
    return this.messageTemplates.delete(id);
  }
}

export const storage = new MemStorage();
