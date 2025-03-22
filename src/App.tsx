// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ThemeProvider } from 'next-themes';
import { FontSizeContext } from '@/contexts/FontSizeContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

const App = () => {
    const [fontSize, setFontSize] = useState(16);

    return (
        <ThemeProvider attribute="class">
            <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout><div><h1>Layout Test</h1><p>This is a placeholder to see if the layout is working.</p></div></Layout>} />
                        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                        <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
                    </Routes>
                </Router>
            </FontSizeContext.Provider>
        </ThemeProvider>
    );
};

export default App;