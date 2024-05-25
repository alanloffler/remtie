import { z } from "zod";

export const citiesSchema = z.object({
	city: z.string().min(3, {
		message: 'El nombre debe poseer al menos 3 caracteres'
	}),
	state: z.string().min(3, {
		message: 'La provincia debe poseer al menos 3 caracteres'
	}),
	zip: z.string().min(3, {
		message: 'El código postal debe poseer al menos 3 caracteres'
	})
});