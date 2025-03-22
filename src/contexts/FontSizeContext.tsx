import React, { createContext, useContext } from 'react';

interface FontSizeContextType {
    fontSize: number;
    setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export const FontSizeContext = createContext<FontSizeContextType>({
    fontSize: 16,
    setFontSize: () => {}
});

export const useFontSize = () => useContext(FontSizeContext);