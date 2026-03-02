import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export const useSignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    field: "username" | "email" | "password",
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await signup(form.username, form.email, form.password);
      setSuccessMessage("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const message = 
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.";
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