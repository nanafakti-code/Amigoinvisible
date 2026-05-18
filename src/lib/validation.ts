import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email().max(120),
  avoidList: z.string().min(2).max(1200),
});

export function sanitizeInput(value: string): string {
  return value.replace(/[<>]/g, "").replace(/[\u0000-\u001F]/g, "").trim();
}

export function sanitizeList(values: string[]): string[] {
  return values.map(sanitizeInput).filter(Boolean);
}

export function isValidImageType(type: string): boolean {
  return ["image/jpeg", "image/png", "image/webp"].includes(type);
}
