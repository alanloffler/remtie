import { z } from "zod";

export const rolesSchema = z.object({
    id: z.coerce.number(),
	name: z.string().min(1, {
		message: 'El nombre no puede estar vacío'
	}),
	title: z.string().min(1, {
		message: 'El título no puede estar vacío'
	}),
	value: z.string().min(1, {
		message: 'El valor no puede estar vacío'
	})
});