import React from 'react';

import { ThemeType } from '../types/types';
import { predefinedThemes } from '../config/themes';

interface Props {
  currentTheme: ThemeType;
  onSelect: (theme: ThemeType) => void;
}

export const ThemeSelector: React.FC<Props> = ({ currentTheme, onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Themes</h3>
      <div className="grid grid-cols-2 gap-4">
        {predefinedThemes.map(theme => (
          <div
            key={theme.name}
            className={`p-4 border rounded cursor-pointer ${
              currentTheme?.name === theme.name ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              if (typeof onSelect === 'function') {
                onSelect(theme);
              } else {
                console.error('onSelect is not a function');
              }
            }}
            style={{
              backgroundColor: theme.backgroundColor,
              borderColor: theme.borderColor,
            }}
          >
            <h4 style={{ color: theme.primaryColor, fontFamily: theme.fontFamily }}>
              {theme.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};