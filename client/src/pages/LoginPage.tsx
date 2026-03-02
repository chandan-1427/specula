import React from "react";
import { useNavigate } from "react-router-dom";

import AuthFormWrapper from "../components/layouts/AuthFormWrapper";
import { CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import FormField from "../components/ui/FormField";

import { useLoginForm } from "../hooks/useLoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    form,
    loading,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <AuthFormWrapper>

      {/* Header */}
      <div className="mb-6 text-center">
        <CardTitle className="mb-2 text-lg normal-case tracking-tight text-white">
          Welcome back
        </CardTitle>
        <p className="text-sm text-zinc-400">
          Sign in to access your dashboard.
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          {successMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Email">
          <Input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </FormField>

        <FormField label="Password">
          <PasswordInput
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </FormField>

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="font-medium cursor-pointer text-indigo-400 hover:text-indigo-300"
        >
          Sign up
        </button>
      </p>

    </AuthFormWrapper>
  );
};

export default LoginPage;