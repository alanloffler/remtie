import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IUser } from "@/lib/interfaces/user.interface";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const emptyUser: IUser = {
    id: 0,
    name: "",
    phone: "",
    email: "",
    role: "",
};
