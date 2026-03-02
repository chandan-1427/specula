import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white px-6">
      <div className="text-center">
        <h1 className="text-6xl font-semibold tracking-tight">404</h1>
        <p className="mt-4 text-sm text-zinc-400">
          The page you’re looking for doesn’t exist.
        </p>

        <div className="mt-6">
          <Button onClick={() => navigate("/")}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;