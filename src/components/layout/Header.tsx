import React, { useRef, useCallback } from "react";
import SamarthanamLogo from "@/assets/samarthanam_logo_nobg.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
import { useFontSize } from "@/contexts/FontSizeContext";
import {
  AArrowDown,
  AArrowUp,
  Baseline,
  Bell,
  Contact2,
  Globe,
  Menu,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebaseConfig";
import { useGetUserProfile } from "@/services/user";
import { useAppDispatch } from "@/store";
import { resetUserDetails } from "@/store/slices/user-slice";
import Loader from "@/utils/loader";
import { useAuthState } from "react-firebase-hooks/auth";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  const { fontSize, setFontSize } = useFontSize();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [u, loading] = useAuthState(auth);
  const { data: user, isLoading } = useGetUserProfile({ isEnabled: !!u });
  const languageDropdownRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLButtonElement>(null);

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

  const handleLanguageDropdownKeyDown = (e: React.KeyboardEvent) => {
    // If Escape is pressed, close the dropdown and refocus the trigger
    if (e.key === "Escape") {
      languageDropdownRef.current?.focus();
    }
  };

  const handleProfileDropdownKeyDown = (e: React.KeyboardEvent) => {
    // If Escape is pressed, close the dropdown and refocus the trigger
    if (e.key === 'Escape') {
      profileDropdownRef.current?.focus();
    }
  };

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    dispatch(resetUserDetails());
  }, [dispatch]);

  const renderUserAuthButton = () => {
    if (loading || isLoading) {
      return <Loader aria-label="Loading user information" />;
    }

    if (u && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger 
            asChild 
            ref={profileDropdownRef}
            aria-label={`User Profile: ${user.displayName}`}
          >
            <Avatar 
              className="cursor-pointer" 
              tabIndex={0}
            >
              <AvatarImage 
                src={user.profileImage} 
                alt={`Profile picture of ${user.displayName}`} 
              />
              <AvatarFallback 
                className="border border-neutral-400"
                aria-label="User Initials"
              >
                {user.displayName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            onKeyDown={handleProfileDropdownKeyDown}
          >
            <DropdownMenuItem 
              onSelect={handleProfileClick}
              className="cursor-pointer"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={handleLogout}
              className="cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link 
        to="/login" 
        className="hover:underline"
        aria-label="Log In to Your Account"
      >
        <Button 
          variant="outline" 
          size="sm"
          tabIndex={0}
        >
          Login
        </Button>
      </Link>
    );
  };

  return (
    <header
      className="select-none bg-background border-b p-4 pl-8 pr-8 flex items-center justify-between"
      aria-label="Main Navigation and Site Controls"
    >
      <Link
        to="/"
        className="flex items-center h-16 w-60"
        aria-label="Samarthanam Home Page"
      >
        <img
          src={SamarthanamLogo}
          alt="Samarthanam Logo"
          className="h-20 w-auto"
        />
      </Link>

      {/* Desktop Menu */}
      <nav
        className="hidden md:flex flex-wrap items-center gap-4 justify-end w-full"
        aria-label="Desktop Navigation Menu"
      >
        
        {/* contact us button linking to /contact */}
        <Link
          to="/contact"
          className="hover:underline"
          aria-label="View Contact Details"
        >
          <Button
            variant="outline"
            size="sm"
            aria-label="Contact Us"
          >
            Contact Us
          </Button>
        </Link>

        <span className="text-gray-400" aria-hidden="true">
          |
        </span>
        
        {/* Font Size Controls */}
        <div
          role="group"
          aria-label="Text Size Adjustment"
          className="flex items-center space-x-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={decreaseFontSize}
            aria-label="Decrease Text Size"
          >
            <AArrowDown className="h-4 w-4" />
            <span className="sr-only">Decrease Text Size</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFontSize}
            aria-label="Reset Text Size to Default"
          >
            <Baseline className="h-4 w-4" />
            <span className="sr-only">Reset Text Size</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={increaseFontSize}
            aria-label="Increase Text Size"
          >
            <AArrowUp className="h-4 w-4" />
            <span className="sr-only">Increase Text Size</span>
          </Button>
        </div>
        

        <span className="text-gray-400" aria-hidden="true">
          |
        </span>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild ref={languageDropdownRef}>
            <Button
              variant="outline"
              size="sm"
              aria-label="Select Language"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <Globe className="h-4 w-4 mr-2" />
              Language
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onKeyDown={handleLanguageDropdownKeyDown}
          >
            <DropdownMenuItem aria-label="Switch to English">
              English
            </DropdownMenuItem>
            <DropdownMenuItem aria-label="Switch to Hindi">
              हिन्दी
            </DropdownMenuItem>
            <DropdownMenuItem aria-label="Switch to Kannada">
              ಕನ್ನಡ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-gray-400" aria-hidden="true">
          |
        </span>

        {/* Theme Switcher */}
        <div aria-label="Theme Switcher">
          <ThemeSwitcher />
        </div>

        <span className="text-gray-400" aria-hidden="true">
          |
        </span>

        {/* Donation Button */}
        <Link
          to="/donate"
          className="hover:underline"
          aria-label="Make a Donation"
        >
          <Button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            variant="outline"
            size="sm"
          >
            Donate Now
          </Button>
        </Link>

        <span className="text-gray-400" aria-hidden="true">
          |
        </span>

        {/* User Authentication Area */}
        <div 
          aria-live="polite" 
          aria-relevant="additions removals"
          className="flex items-center"
        >
          {renderUserAuthButton()}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className="md:hidden flex items-center gap-2"
        aria-label="Mobile Navigation Menu"
      >
        <Link
          to="/donate"
          className="hover:underline"
          aria-label="Make a Donation"
        >
          <Button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            variant="outline"
            size="sm"
          >
            Donate Now
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            sideOffset={5}
            alignOffset={0}
          >
            {/* Mobile Menu Items with Improved Accessibility */}

            <DropdownMenuItem>
              <Link
                to="/contact"
                className="w-full flex items-center"
                aria-label="View Contact Details"
              >
                <Contact2 className="h-4 w-4 mr-2" /> Contact Us
              </Link>
            </DropdownMenuItem>

            {/* Font Size Controls for Mobile */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                decreaseFontSize();
              }}
              aria-label="Decrease Text Size"
            >
              <AArrowDown className="h-4 w-4 mr-2" /> Reduce Text
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                resetFontSize();
              }}
              aria-label="Reset Text Size to Default"
            >
              <Baseline className="h-4 w-4 mr-2" /> Reset Text
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                increaseFontSize();
              }}
              aria-label="Increase Text Size"
            >
              <AArrowUp className="h-4 w-4 mr-2" /> Increase Text
            </DropdownMenuItem>

            {/* Language Selector for Mobile */}
            <DropdownMenuItem aria-label="Select English Language">
              <Globe className="h-4 w-4 mr-2" /> English
            </DropdownMenuItem>

            <DropdownMenuItem aria-label="Select Hindi Language">
              <Globe className="h-4 w-4 mr-2" /> हिन्दी
            </DropdownMenuItem>

            <DropdownMenuItem aria-label="Select Kannada Language">
              <Globe className="h-4 w-4 mr-2" /> ಕನ್ನಡ
            </DropdownMenuItem>

            {/* Notifications and Theme Switcher */}
            <DropdownMenuItem aria-label="View Notifications">
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              aria-label="Switch Website Theme"
            >
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
