import { useState, useCallback } from 'react';
import { HistoryState, WidgetData } from '../types/types';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: [],
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    
    setHistory(prev => {
      const newPast = [...prev.past];
      const previous = newPast.pop()!;
      
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, [canUndo]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    
    setHistory(prev => {
      const newFuture = [...prev.future];
      const next = newFuture.shift()!;
      
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, [canRedo]);

  const saveToHistory = useCallback((newPresent: WidgetData[]) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: newPresent,
      future: []
    }));
  }, []);

  return {
    history,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    saveToHistory
  };
};