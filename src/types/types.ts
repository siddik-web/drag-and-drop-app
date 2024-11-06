export type ElementStyle = {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
  padding?: number;
};

export type CertificateElement = {
  id: string;
  type: "text" | "title" | "signature" | "date";
  content: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  isEditing?: boolean;
  style: ElementStyle;
};
export type ThemeType = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  backgroundColor: string;
  borderColor: string;
};
export type CertificateTemplate = {
  id: string;
  name: string;
  elements: CertificateElement[];
  theme: ThemeType;
};

export type CertificateContextType = {
  elements: CertificateElement[];
  addElement: (element: CertificateElement) => void;
  updateElement: (id: string, updates: Partial<CertificateElement>) => void;
  removeElement: (id: string) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
};
