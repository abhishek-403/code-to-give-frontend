import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SamarthanamLogo from '@/assets/samarthanam_logo_nobg.png';
import { Menu, Contact2, Baseline, AArrowUp, AArrowDown, Bell, Globe, SkipForward } from 'lucide-react';
import ThemeSwitcher from "./ThemeSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useFontSize } from '@/contexts/FontSizeContext'; 

const Header = () => {
    const { fontSize, setFontSize } = useFontSize(); 
    const [isLoggedIn, setIsLoggedIn] = useState(true); //!!! need later implementation of user authentication
    const [announceFontSize, setAnnounceFontSize] = useState(false);

    // Announce font size changes for screen readers
    useEffect(() => {
        if (announceFontSize) {
            const timeout = setTimeout(() => setAnnounceFontSize(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [announceFontSize]);

    const increaseFontSize = () => {
        if (fontSize < 20) {
            setFontSize(fontSize + 2);
            setAnnounceFontSize(true);
        }
    };

    const decreaseFontSize = () => {
        if (fontSize > 12) {
            setFontSize(fontSize - 2);
            setAnnounceFontSize(true);
        }
    };

    const resetFontSize = () => {
        setFontSize(16);
        setAnnounceFontSize(true);
    };

    return (
        <>
            {/* Skip to content link for keyboard users */}
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 z-50 rounded"
            >
                Skip to main content
            </a>
            
            {/* Accessibility announcement for screen readers */}
            {announceFontSize && (
                <div role="status" aria-live="polite" className="sr-only">
                    Font size changed to {fontSize} pixels
                </div>
            )}
            
            <header className="bg-background border-b p-4 pl-8 pr-8 flex items-center justify-between" role="banner">
                <Link 
                    to="/" 
                    className="flex items-center h-16 w-60"
                    aria-label="Samarthanam Trust for the Disabled - Homepage"
                >
                    <img src={SamarthanamLogo} alt="Samarthanam Trust for the Disabled Logo" className="h-20 w-auto" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex flex-wrap items-center gap-2 justify-end w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="sm"
                                aria-label="Contact options"
                            >
                                <Contact2 className="h-4 w-4" /> Contact Us
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link to="/contact-form" className="w-full block">Contact Form</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="/contact-details" className="w-full block">Contact Details</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <span className="text-foreground/40 font-bold" aria-hidden="true">|</span>

                    <div role="group" aria-label="Font size controls" className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={decreaseFontSize}
                            aria-label="Decrease font size"
                        >
                            <AArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={resetFontSize}
                            aria-label="Reset font size"
                        >
                            <Baseline className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={increaseFontSize}
                            aria-label="Increase font size"
                        >
                            <AArrowUp className="h-4 w-4" />
                        </Button>
                    </div>

                    <span className="text-foreground/40 font-bold" aria-hidden="true">|</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="sm"
                                aria-label="Language selection"
                            >
                                <Globe className="h-4 w-4" />
                                Language
                                {/* drop down icon */}
                                
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>English</DropdownMenuItem>
                            <DropdownMenuItem>हिन्दी</DropdownMenuItem>
                            <DropdownMenuItem>ಕನ್ನಡ</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <span className="text-foreground/40 font-bold" aria-hidden="true">|</span>

                    <ThemeSwitcher />

                    <span className="text-foreground/40 font-bold" aria-hidden="true">|</span>

                    {isLoggedIn ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 pt-5 pb-5"
                                        aria-label="User profile menu"
                                    >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="user profile picture" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <span>Profile</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Link to="/profile" className="w-full block">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/settings" className="w-full block">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <button className="w-full text-left">Logout</button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                                variant="outline" 
                                size="sm"
                                aria-label="View notifications"
                            >
                                <Bell className="h-4 w-4" /> Notifications
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="font-medium border-2 hover:bg-accent"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup" className="hover:underline">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="font-medium border-2 hover:bg-accent"
                                >
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="icon"
                                className="border-2 hover:bg-accent"
                                aria-label="Open menu"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" sideOffset={5} alignOffset={0}>
                            <DropdownMenuItem>
                                <Link to="/contact-form" className="w-full flex items-center">
                                    <Contact2 className="h-4 w-4 mr-2" /> Contact Form
                                </Link>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem>
                                <Link to="/contact-details" className="w-full flex items-center">
                                    <Contact2 className="h-4 w-4 mr-2" /> Contact Details
                                </Link>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onSelect={(e) => {e.preventDefault(); decreaseFontSize();}}>
                                <AArrowDown className="h-4 w-4" /> Reduce Text
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onSelect={(e) => {e.preventDefault(); resetFontSize();}}>
                                <Baseline className="h-4 w-4" /> Reset Text
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onSelect={(e) => {e.preventDefault(); increaseFontSize();}}>
                                <AArrowUp className="h-4 w-4" /> Increase Text
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem>
                                <Globe className="h-4 w-4" /> English
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem>
                                <Globe className="h-4 w-4" /> हिन्दी
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem>
                                <Globe className="h-4 w-4" /> ಕನ್ನಡ
                            </DropdownMenuItem>
                            
                            {isLoggedIn ? (
                                <>
                                    <DropdownMenuItem>
                                        <Link to="/profile" className="w-full flex items-center">
                                            <Avatar className="h-5 w-5 mr-2">
                                                <AvatarImage src="https://github.com/shadcn.png" alt="" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/settings" className="w-full flex items-center">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <button className="w-full text-left">Logout</button>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem>
                                        <Link to="/login" className="w-full block">Login</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/signup" className="w-full block">Register</Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                            
                            <DropdownMenuItem>
                                <Bell className="h-4 w-4" /> Notifications
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <div className="flex items-center w-full">
                                    <ThemeSwitcher />
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </>
    );
};

export default Header;