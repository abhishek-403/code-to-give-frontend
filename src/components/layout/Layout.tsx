import React, { ReactNode, useContext } from "react";
import { ThemeProvider } from "next-themes";
import Header from "./Header";
import Footer from "./Footer";
import { FontSizeContext } from "@/contexts/FontSizeContext"; // Import the Context

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { fontSize } = useContext(FontSizeContext);

  React.useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    // Or alternatively:
    // document.body.style.fontSize = `${fontSize}px`;
  }, [fontSize]);
  return (
    <ThemeProvider attribute="class">
      <div className="flex flex-col min-h-screen" style={{ fontSize: `${fontSize}px` }}> {/* Apply font size to the entire layout */}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;