import { z } from "zod";

export const categoriesSchema = z.object({
	name: z.string().min(3, {
		message: 'El nombre debe poseer al menos 3 caracteres'
	}),
	plural: z.string().min(3, {
		message: 'El plural debe poseer al menos 3 caracteres'
	}),
    color: z.string().min(7, {
        message: 'El color debe poseer 7 caracteres (#000000)'
    })
});