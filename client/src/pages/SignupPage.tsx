import React from "react";
import { useNavigate } from "react-router-dom";

import AuthFormWrapper from "../components/layouts/AuthFormWrapper";
import { CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import FormField from "../components/ui/FormField";

import { useSignupForm } from "../hooks/useSignupForm";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    form,
    loading,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
  } = useSignupForm();

  return (
    <AuthFormWrapper>

      {/* Header */}
      <div className="mb-8 text-center">
        <CardTitle className="mb-2 text-lg normal-case tracking-tight text-white">
          Create your account
        </CardTitle>
        <p className="text-sm text-zinc-400">
          Get started in a few seconds.
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
        <FormField label="Username">
          <Input
            type="text"
            placeholder="yourname"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            required
          />
        </FormField>

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
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-medium cursor-pointer text-indigo-400 hover:text-indigo-300"
        >
          Log in
        </button>
      </p>

    </AuthFormWrapper>
  );
};

export default SignupPage;