import z from "zod";

export const REQUEST_BODY_SCHEMA = z.object({
    message: z.string(),
    severity: z.string(),
    date: z.string()
})