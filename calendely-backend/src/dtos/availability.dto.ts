import { z } from "zod";

export const createAvailabilityBaseSchema = z.object({
  weekDay: z.number().int().min(0).max(6, "Weekday must be between 0 (Sunday) and 6 (Saturday)"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be in HH:MM format"),
  isActive: z.boolean().optional(),
  timezone: z.string().optional().default("UTC"),
});

export const createAvailabilityRuleSchema = createAvailabilityBaseSchema.refine(rule => rule.startTime < rule.endTime, {
  message: "Start time must be before end time"
});

export const updateAvailabilityRuleSchema = createAvailabilityRuleSchema.partial();

export type CreateAvailabilityRuleDto = z.infer<typeof createAvailabilityRuleSchema>;
export type UpdateAvailabilityRuleDto = z.infer<typeof updateAvailabilityRuleSchema>;

export const createAvailabilityExceptionBaseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  type: z.enum(["BLOCK_FULL_DAY", "BLOCK_PARTIAL", "ADD_AVAILABLE_WINDOW"]),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be in HH:MM format"),
  timezone: z.string().optional().default("UTC"),
  reason: z.string().max(500, "Reason must be less than 500 characters").optional().nullable(),
});

export const createAvailabilityExceptionSchema = createAvailabilityExceptionBaseSchema.superRefine((data, ctx) => {
  if(data.type !== "BLOCK_FULL_DAY") {

    if(!data.startTime || !data.endTime) {
      ctx.addIssue({
        code: "custom",
        message: 'Start time and end time are required for non-full day blocks',
        path: ['startTime'],
      });
    }
    

  if (data.startTime >= data.endTime) {
    ctx.addIssue({
      code: "custom",
      message: 'Start time must be before end time',
      path: ['startTime'],
    });
  }
}
});

export const updateAvailabilityExceptionSchema = createAvailabilityExceptionSchema.partial();

export type CreateAvailabilityExceptionDto = z.infer<typeof createAvailabilityExceptionSchema>;
export type UpdateAvailabilityExceptionDto = z.infer<typeof updateAvailabilityExceptionSchema>;
