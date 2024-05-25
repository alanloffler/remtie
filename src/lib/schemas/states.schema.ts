import { z } from 'zod';

export const statesSchema = z.object({
	state: z.string().min(3, {
		message: 'La provincia debe poseer al menos 3 caracteres'
	})
});
