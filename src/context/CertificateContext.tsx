import { createContext } from "react";
import { CertificateContextType } from "../types/types";
import { initialTheme } from "./theme";


// Default context value (placeholder functions)
const defaultContextValue: CertificateContextType = {
  elements: [],
  setElements: () => {},
  currentTheme: initialTheme,
  setCurrentTheme: () => {},
  undo: () => {},
  redo: () => {},
  canUndo: false,
  canRedo: false,
};

// Create the CertificateContext
export const CertificateContext = createContext<CertificateContextType>(defaultContextValue);
