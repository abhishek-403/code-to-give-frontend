import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SamarthanamLogo from '@/assets/samarthanam_logo_nobg.png';
import { Menu, Contact2, Baseline, AArrowUp, AArrowDown, Bell, Search, Globe } from 'lucide-react';
import ThemeSwitcher from "./ThemeSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useFontSize } from '@/contexts/FontSizeContext'; 

const Header = () => {
    const { fontSize, setFontSize } = useFontSize(); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); //!!! need later implementation of user authentication

    const increaseFontSize = () => {
        if (fontSize < 20) {
            setFontSize(fontSize + 2);
        }
    };

    const decreaseFontSize = () => {
        if (fontSize > 12) {
            setFontSize(fontSize - 2);
        }
    };

    const resetFontSize = () => {
        setFontSize(16);
    };

    return (
        <header className="bg-background border-b p-4 flex items-center justify-between">
            <Link to="/" className="flex items-center h-20 w-auto">
                <img src={SamarthanamLogo} alt="Samarthanam Logo" className="h-20 w-auto" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex flex-wrap items-center gap-4 justify-end w-full">
				<div className="flex items-center border rounded-lg p-1 h-9 mr-16">
					<Input placeholder="Search..." className="border-none shadow-none focus-visible:ring-0 h-5 w-25" />
					<Button variant="ghost" size="sm">
						<Search className="h-4 w-4" />
					</Button>
				</div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Contact2 className="h-4 w-4 mr-2" /> Contact Us
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><a href="/contact-form" className="block w-full">Contact Form</a></DropdownMenuItem>
                        <DropdownMenuItem><a href="/contact-details" className="block w-full">Contact Details</a></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <span className="text-gray-400">|</span>

                <Button variant="outline" size="icon" onClick={decreaseFontSize}><AArrowDown className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={resetFontSize}><Baseline className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={increaseFontSize}><AArrowUp className="h-4 w-4" /></Button>

                <span className="text-gray-400">|</span>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Globe className="h-4 w-4 mr-2" />
							Language
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>English</DropdownMenuItem>
						<DropdownMenuItem>हिन्दी</DropdownMenuItem>
						<DropdownMenuItem>ಕನ್ನಡ</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

                <span className="text-gray-400">|</span>

                <ThemeSwitcher />

                <span className="text-gray-400">|</span>

                {isLoggedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><Link to="/profile">Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link to="/settings">Settings</Link></DropdownMenuItem>
                            <DropdownMenuItem><Button>Logout</Button></DropdownMenuItem>
                        </DropdownMenuContent>
                        <Button variant="outline" size="sm"><Bell className="h-4 w-4 mr-2" /> Notifications</Button>
                    </DropdownMenu>
                ) : (
                    <>
                        <Link to="/login" className="hover:underline"><Button variant="outline" size="sm">Login</Button></Link>
                        <Link to="/signup" className="hover:underline"><Button variant="outline" size="sm">Register</Button></Link>
                    </>
                )}

            </div>


        <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon"><Menu className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" sideOffset={5} alignOffset={0}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                            <div className="flex items-center border rounded-lg p-1 h-9 w-full" onClick={(e) => e.stopPropagation()}>
                                <Input 
                                    placeholder="Search..." 
                                    className="border-none shadow-none focus-visible:ring-0 h-5 w-full"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                                <Search className="h-4 w-4 mr-1" />
                            </div>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                            <Link to="/contact-form" className="flex items-center cursor-default">
                                <Contact2 className="h-4 w-4 mr-2" /> Contact Form
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                            <Link to="/contact-details" className="flex items-center cursor-default">
                                <Contact2 className="h-4 w-4 mr-2" /> Contact Details
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onSelect={(e) => {e.preventDefault(); decreaseFontSize();}}>
                            <AArrowDown className="h-4 w-4 mr-2" /> Reduce Text
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onSelect={(e) => {e.preventDefault(); resetFontSize();}}>
                            <Baseline className="h-4 w-4 mr-2" /> Reset Text
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onSelect={(e) => {e.preventDefault(); increaseFontSize();}}>
                            <AArrowUp className="h-4 w-4 mr-2" /> Increase Text
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem>
                            <Globe className="h-4 w-4 mr-2" /> English
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem>
                            <Globe className="h-4 w-4 mr-2" /> हिन्दी
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem>
                            <Globe className="h-4 w-4 mr-2" /> ಕನ್ನಡ
                        </DropdownMenuItem>
                        
                        {isLoggedIn ? (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link to="/profile" className="flex items-center cursor-default">
                                        <Avatar className="h-5 w-5 mr-2">
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/settings" className="flex items-center cursor-default">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link to="/login" className="cursor-default">Login</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/signup" className="cursor-default">Register</Link>
                                </DropdownMenuItem>
                            </>
                        )}
                        
                        <DropdownMenuItem>
                            <Bell className="h-4 w-4 mr-2" /> Notifications
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
    );
};

export default Header;