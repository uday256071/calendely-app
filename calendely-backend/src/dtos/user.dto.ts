import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters").optional(), 
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
