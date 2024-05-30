import { z } from "zod";

export const citiesSchema = z.object({
	city: z.string().min(3, {
		message: 'La ciudad debe poseer al menos 3 caracteres'
	}),
	state: z.coerce.number().min(1, {
		message: 'Debes elegir una provincia'
	}),
	zip: z.string().min(3, {
		message: 'El código postal debe poseer al menos 3 caracteres'
	})
});