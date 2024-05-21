import { z } from 'zod';

export const settingsSchema = z.object({
	value: z.string().min(1, {
		message: 'El valor debe poseer al menos 1 caracter'
	})
});
