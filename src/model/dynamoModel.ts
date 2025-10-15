import z from "zod";

export const DYNAMO_TABLE_SCHEMA = z.object({
   'audrey-counter': z.number()
})