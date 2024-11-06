import React, { createContext, useState } from "react";
import { CertificateContextType, CertificateElement, ThemeType } from "../types/types";

// Create a default empty context
const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

// Provider implementation
export const CertificateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CertificateElement[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>({ backgroundColor: "white", borderColor: "black", name: "default", primaryColor: "black", secondaryColor: "white", fontFamily: "Arial" });
  
  const undo = () => { /* Implementation for undo */ };
  const redo = () => { /* Implementation for redo */ };
  const canUndo = false; // Update with actual logic
  const canRedo = false; // Update with actual logic
  const selectedElement = undefined; // Update with actual selected element logic

  return (
    <CertificateContext.Provider value={{
      elements,
      setElements,
      currentTheme,
      setCurrentTheme,
      undo,
      redo,
      canUndo,
      canRedo,
      selectedElement,
    }}>
      {children}
    </CertificateContext.Provider>
  );
};