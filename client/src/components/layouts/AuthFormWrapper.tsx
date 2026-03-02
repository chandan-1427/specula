import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Card } from "../ui/Card";

interface AuthFormWrapperProps {
  children: React.ReactNode;
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 pt-20 pb-8">
        <Card className="w-full max-w-md p-8 backdrop-blur-md">
          {children}
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AuthFormWrapper;