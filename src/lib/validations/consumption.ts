import { z } from "zod";

export const ConsumeEventSchema = z.object({
  wineId:      z.string().min(1),
  consumedAt:  z.string().datetime(),
  occasion:    z.string().max(200).nullable().optional(),
  rating:      z.number().int().min(1).max(100).nullable().optional(),
  tastingNote: z.string().max(5000).nullable().optional(),
});

export type ConsumeEventValues = z.infer<typeof ConsumeEventSchema>;
