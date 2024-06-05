import { useContext } from "react";
import { DatabaseContext } from "@/contexts/DatabaseContext";

export const useDatabaseContext = () => {
  return useContext(DatabaseContext);
};
