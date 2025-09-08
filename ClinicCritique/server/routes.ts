import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertComplaintSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit complaint endpoint
  app.post("/api/complaints", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertComplaintSchema.parse(req.body);
      
      // Store complaint in memory
      const complaint = await storage.createComplaint(validatedData);
      
      // Send to n8n webhook
      const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.WEBHOOK_URL || "https://your-n8n-instance.com/webhook/patient-complaint";
      
      try {
        await axios.post(webhookUrl, {
          complaintId: complaint.id,
          patient: {
            firstName: complaint.patientFirstName,
            lastName: complaint.patientLastName,
            email: complaint.patientEmail,
            phone: complaint.patientPhone,
          },
          clinic: {
            name: complaint.clinicName,
            website: complaint.clinicWebsite,
            email: complaint.clinicEmail,
            phone: complaint.clinicPhone,
            fax: complaint.clinicFax,
            address: complaint.clinicAddress,
          },
          complaint: {
            types: complaint.complaintTypes,
            description: complaint.complaintDescription,
            dateOfIncident: complaint.dateOfIncident,
          },
          consent: {
            contact: complaint.consentContact,
            updates: complaint.consentUpdates,
          },
          submittedAt: complaint.submittedAt,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        });
        
        // Mark as sent
        complaint.webhookSent = true;
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Continue with response even if webhook fails
      }
      
      res.json({ 
        success: true, 
        complaintId: complaint.id,
        submittedAt: complaint.submittedAt 
      });
    } catch (error) {
      console.error('Complaint submission error:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Invalid request data' 
      });
    }
  });

  // Get complaint by ID (for confirmation)
  app.get("/api/complaints/:id", async (req, res) => {
    try {
      const complaint = await storage.getComplaint(req.params.id);
      if (!complaint) {
        return res.status(404).json({ error: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
