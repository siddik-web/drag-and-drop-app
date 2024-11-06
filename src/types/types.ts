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
  previewImage: string | undefined;
  id: string;
  name: string;
  elements: CertificateElement[];
  theme: ThemeType;
};

export interface CertificateContextType {
  elements: CertificateElement[];
  setElements: (update: React.SetStateAction<CertificateElement[]>) => void;
  currentTheme: ThemeType;
  setCurrentTheme: (update: React.SetStateAction<ThemeType>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedElement?: CertificateElement;
}

