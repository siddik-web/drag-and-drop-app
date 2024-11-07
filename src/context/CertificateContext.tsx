import React, { createContext, useState} from 'react';

interface Element {
  id: string;
  type: 'text' | 'image' | 'shape';
  content?: string;
}

interface CertificateContextType {
  elements: Element[];
  addElement: (element: Element) => void;
  updateElement: (id: string, newElement: Partial<Element>) => void;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<Element[]>([]);

  const addElement = (element: Element) => {
    setElements((prev) => {
      // Prevent duplicate elements
      if (!prev.some((el) => el.id === element.id)) {
        return [...prev, element];
      }
      return prev;
    });
  };

  const updateElement = (id: string, newElement: Partial<Element>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newElement } : el))
    );
  };

  return (
    <CertificateContext.Provider value={{ elements, addElement, updateElement }}>
      {children}
    </CertificateContext.Provider>
  );
};

export default CertificateContext;