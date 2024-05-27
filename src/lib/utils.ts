import { IMarker } from "./interfaces/google-map.interface";
import { IUser } from "@/lib/interfaces/user.interface";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
// Shadcn-ui
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
// User
export const emptyUser: IUser = {
    id: 0,
    name: "",
    phone: "",
    email: "",
    role: "",
};
// Google Map
export function confirmMapExistence(marker: IMarker) {
    if ((marker.lat === 0 && marker.lng === 0) || marker.key === '' || marker.key === null || marker.zoom === 0) return false;
    return true;
}