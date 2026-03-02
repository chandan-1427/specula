import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (field: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await login(form.email, form.password);
      setSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      const message = 
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
  };
};