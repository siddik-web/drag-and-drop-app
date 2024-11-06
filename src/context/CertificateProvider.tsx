import React from 'react';
import { CertificateContext } from './CertificateContext';
import { CertificateElement, ThemeType } from '../types/types';
import { useHistory } from '../hooks/useHistory';
import { initialTheme } from './theme';

export const CertificateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: elements,
    set: setElements,
    undo: undoElements,
    redo: redoElements,
    canUndo: canUndoElements,
    canRedo: canRedoElements,
  } = useHistory<CertificateElement[]>([] as CertificateElement[]);

  const {
    state: currentTheme,
    set: setCurrentTheme,
    undo: undoTheme,
    redo: redoTheme,
    canUndo: canUndoTheme,
    canRedo: canRedoTheme,
  } = useHistory<ThemeType>(initialTheme as ThemeType);

  // Combined undo and redo handlers
  const undo = () => {
    undoElements();
    undoTheme();
  };

  const redo = () => {
    redoElements();
    redoTheme();
  };

  // Check if undo/redo is available for both elements and theme
  const canUndo = canUndoElements || canUndoTheme;
  const canRedo = canRedoElements || canRedoTheme;

  return (
    <CertificateContext.Provider
      value={{
        elements,
        setElements,
        currentTheme,
        setCurrentTheme,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
};
