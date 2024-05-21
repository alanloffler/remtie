import { z } from 'zod';

export const rowsPerPageSchema = z.object({    
	value: z.coerce
        .number({ invalid_type_error: 'La cantidad debe ser un número' })
        .positive({ message: 'La cantidad debe ser mayor a cero' })
});
