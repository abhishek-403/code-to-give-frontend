import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase'; // Assuming you have your Firebase config in firebase.ts
import { useAuthState } from 'react-firebase-hooks/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [user, loading, authError] = useAuthState(auth);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to home on successful login
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); // Redirect to home on successful login
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (authError) {
        return <div>Error: {authError.message}</div>;
    }

    if (user) {
        navigate('/');
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col space-y-4 w-80">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit">Login</Button>
                <Button type="button" variant="outline" onClick={handleGoogleLogin}>Login with Google</Button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <p className="mt-4">
                Don't have an account? <Button variant="link" onClick={() => navigate('/signup')}>Sign up</Button>
            </p>
        </div>
    );
};

export default LoginPage;