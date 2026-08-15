import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}





// // ================ FOR THE DATABASE ============ 

// username = mwansapeter800_db_user
// password = CqAdEGc2cWHE6RTj