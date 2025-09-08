import { useContext } from "react";
import { EmblemContext } from "@/components/EmblemProvider";

export function useEmblem() {
  return useContext(EmblemContext);
}