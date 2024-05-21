import { z } from "zod";

export const businessSchema = z.object({
	name: z.string().min(3, {
		message: 'El nombre debe poseer al menos 3 caracteres'
	}),
	plural: z.string().min(3, {
		message: 'El plural debe poseer al menos 3 caracteres'
	})
});