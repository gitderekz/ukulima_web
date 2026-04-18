import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatLocation = (data: any) => ({
  zone: data.zone || '',
  cpp: data.cpp || '',
  region: data.region || '',
  district: data.district || '',
  ward: data.ward || '',
  street: data.street || '',
});