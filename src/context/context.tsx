import React, { createContext, useContext, useState } from 'react';
import { CertificateContextType, CertificateElement } from '../types/types';
const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CertificateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const addElement = (element: CertificateElement) => {
    setElements([...elements, element]);
  };

  const updateElement = (id: string, updates: Partial<CertificateElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };
  

  return (
    <CertificateContext.Provider value={{
      elements,
      addElement,
      updateElement,
      removeElement,
      selectedElement,
      setSelectedElement
    }}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) throw new Error('useCertificate must be used within a CertificateProvider');
  return context;
};