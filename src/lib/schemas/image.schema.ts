import z from 'zod';

const IMAGE_TYPES: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

export const imageFormSchema = z.object({
	file: z
		.any()
		.refine((file) => file?.length == 1, 'Debes elegir una imágen')
		.refine((file) => IMAGE_TYPES.includes(file?.[0]?.type), 'Se aceptan solamente archivos .jpg, .jpeg, o .png')
});
