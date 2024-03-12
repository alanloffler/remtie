import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "@/lib/interfaces";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const emptyUser: User = {
    id: "",
    name: "",
    phone: "",
    email: "",
    type: "",
};
