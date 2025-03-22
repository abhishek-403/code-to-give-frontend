import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ThemeProvider } from 'next-themes';
import { FontSizeContext } from '@/contexts/FontSizeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

import EventRegistrationVolunteerPage from './pages/EventRegistrationVolunteerPage';
import UserProfilePage from './pages/UserProfilePage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';

const App = () => {
    const [fontSize, setFontSize] = useState(16);

    return (
        <ThemeProvider attribute="class">
            <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout><HomePage /></Layout>} />
                        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                        <Route path="/signup" element={<Layout><SignupPage /></Layout>} />

                        <Route path="/volunteer/register/:eventId" element={<Layout><EventRegistrationVolunteerPage /></Layout>} />
                        <Route path="/profile" element={<Layout><UserProfilePage /></Layout>} />

                        <Route path="/admin" element={<Layout><AdminDashboardPage /></Layout>} />
                    </Routes>
                </Router>
            </FontSizeContext.Provider>
        </ThemeProvider>
    );
};

export default App;