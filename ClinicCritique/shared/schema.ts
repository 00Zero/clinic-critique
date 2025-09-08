import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientFirstName: text("patient_first_name").notNull(),
  patientLastName: text("patient_last_name").notNull(),
  patientEmail: text("patient_email").notNull(),
  patientPhone: text("patient_phone"),
  
  clinicName: text("clinic_name").notNull(),
  clinicWebsite: text("clinic_website"),
  clinicEmail: text("clinic_email"),
  clinicPhone: text("clinic_phone"),
  clinicFax: text("clinic_fax"),
  clinicAddress: text("clinic_address"),
  
  complaintTypes: json("complaint_types").$type<string[]>().notNull(),
  complaintDescription: text("complaint_description").notNull(),
  dateOfIncident: text("date_of_incident"),
  
  consentContact: boolean("consent_contact").notNull().default(false),
  consentUpdates: boolean("consent_updates").notNull().default(false),
  
  submittedAt: timestamp("submitted_at").defaultNow(),
  webhookSent: boolean("webhook_sent").notNull().default(false),
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  submittedAt: true,
  webhookSent: true,
}).extend({
  patientEmail: z.string().email("Please enter a valid email address"),
  clinicEmail: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  clinicWebsite: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  complaintTypes: z.array(z.string()).min(1, "Please select at least one complaint type"),
  complaintDescription: z.string().min(20, "Please provide a more detailed description (at least 20 characters)"),
  consentContact: z.boolean().refine(val => val === true, "You must consent to allow us to contact the healthcare practice"),
});

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;
