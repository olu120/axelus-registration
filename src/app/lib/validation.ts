// src/lib/validation.ts
import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(6),
  businessName: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  stage: z.enum(["IDEA", "Y1_2", "Y3_PLUS"]),
  challenge: z.string().min(5),
  heardFrom: z.enum(["INSTAGRAM", "WHATSAPP", "REFERRAL", "OTHER"]),
});
