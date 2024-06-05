import { createContext } from "react";
import { db } from "@/db";

export const DatabaseContext = createContext(db);
