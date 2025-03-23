import { FontSizeContext } from "@/contexts/FontSizeContext"; // Import the Context
import React, { ReactNode, useContext } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { fontSize } = useContext(FontSizeContext);

  React.useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ fontSize: `${fontSize}px` }}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
