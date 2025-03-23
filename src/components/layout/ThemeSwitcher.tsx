import { useTheme } from '@/lib/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    if (!theme) {
        return null; 
    }

    return (
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}

            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeSwitcher;