import { z } from "zod";

export const WineFormSchema = z.object({
  name:            z.string().min(1, "Name is required").max(200),
  producer:        z.string().min(1, "Producer is required").max(200),
  vintage:         z
                     .number()
                     .int()
                     .min(1800)
                     .max(new Date().getFullYear() + 1)
                     .nullable()
                     .optional(),
  type:            z.enum(["red", "white", "rosé", "sparkling", "dessert", "fortified"]),
  varietal:        z.string().max(200).nullable().optional(),
  region:          z.string().max(200).nullable().optional(),
  appellation:     z.string().max(200).nullable().optional(),
  country:         z.string().max(100).nullable().optional(),
  quantity:        z.number().int().min(0).max(9999).default(1),
  format:          z.string().default("750ml"),
  storageLocation: z.string().max(500).nullable().optional(),
  purchasePrice:   z.number().min(0).max(999999).nullable().optional(),
  purchaseDate:    z
                     .string()
                     .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
                     .nullable()
                     .optional(),
  purchaseSource:  z.string().max(200).nullable().optional(),
  drinkFrom:       z
                     .string()
                     .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
                     .nullable()
                     .optional(),
  drinkBy:         z
                     .string()
                     .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
                     .nullable()
                     .optional(),
  notes:           z.string().max(5000).nullable().optional(),
});

export type WineFormValues = z.infer<typeof WineFormSchema>;
