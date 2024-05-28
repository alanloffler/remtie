import { z } from 'zod';

export const settingsSchema = z.object({
	value: z.string().min(1, {
		message: 'El valor debe poseer al menos 1 caracter'
	})
});

export const mapSettingsSchema = z.object({
	lat: z.string().min(1, {
		message: 'El valor debe poseer al menos 1 caracter'
	}),
	lng: z.string().min(1, {
		message: 'El valor debe poseer al menos 1 caracter'
	}),
    zoom: z.coerce.number({ invalid_type_error: 'El zoom debe ser un número' }).positive(),
    mapType: z.string().min(1, {
		message: 'Debes elegir un tipo de mapa'
	}),
});
