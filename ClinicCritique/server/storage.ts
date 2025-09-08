import { type Complaint, type InsertComplaint } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getComplaint(id: string): Promise<Complaint | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private complaints: Map<string, Complaint>;

  constructor() {
    this.users = new Map();
    this.complaints = new Map();
  }

  async getUser(id: string): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    const complaint: Complaint = {
      ...insertComplaint,
      id,
      submittedAt: new Date(),
      webhookSent: false,
    };
    this.complaints.set(id, complaint);
    return complaint;
  }

  async getComplaint(id: string): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }
}

export const storage = new MemStorage();
