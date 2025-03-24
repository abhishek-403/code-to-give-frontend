import { useTheme } from '@/lib/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    if (!theme) {
        return null; // Return null if the component is not mounted
    }

    return (
        <Button variant="outline" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
        </Button>
    );
};

export default ThemeSwitcher;