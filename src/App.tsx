// src/App.tsx (or main.tsx)
import { useState } from 'react';
import Layout from './components/layout/Layout';
import { ThemeProvider } from 'next-themes';
import { FontSizeContext } from '@/contexts/FontSizeContext';

const App = () => {
    const [fontSize, setFontSize] = useState(16);

    return (
        <ThemeProvider attribute="class">
            <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
                <Layout>
                    <div>
                        <h1>Layout Test</h1>
                        <p>This is a placeholder to see if the layout is working.</p>
                    </div>
                </Layout>
            </FontSizeContext.Provider>
        </ThemeProvider>
    );
};

export default App;