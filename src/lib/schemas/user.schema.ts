import { UsersConfig } from '@/lib/config/users.config';
import { z } from 'zod';

export const userSchema = z.object({
	name: z.string().min(3, {
		message: UsersConfig.schemas.createUser.nameMessage
	}),
	email: z.string().email({ message: UsersConfig.schemas.createUser.emailFormat }),
	password: z.string().min(6, {
		message: UsersConfig.schemas.createUser.emailMessage
	}),
	phone: z.string().optional(),
	role: z.string().min(1, {
		message: UsersConfig.schemas.createUser.roleMessage
	})
});

export const updateUserSchema = z.object({
    name: z.string().min(3, {
		message: UsersConfig.schemas.createUser.nameMessage
    }),
    email: z.string().email({ message: UsersConfig.schemas.createUser.emailFormat }),
    password: z.string().optional(),
    phone: z.string().optional(),
    role: z.string().min(1, {
        message: UsersConfig.schemas.createUser.roleMessage
    })
});