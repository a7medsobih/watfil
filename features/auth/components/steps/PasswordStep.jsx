"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getFieldError,
  loginCustomer,
} from "@/features/auth/api/customer-auth";

export default function PasswordStep({
  phone,
  onBack,
  onSuccess,
  onSuspended,
  onError,
}) {
  const t = useTranslations("auth");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    onError?.("");
    setFieldError("");

    if (!password.trim()) {
      setFieldError(t("errors.passwordRequired"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginCustomer({ phone, password });
      await onSuccess(response);
    } catch (error) {
      if (error?.status === 403) {
        onSuspended?.(error.message || t("errors.suspended"));
        return;
      }

      if (error?.status === 422) {
        const message =
          getFieldError(error, "password") ||
          getFieldError(error, "phone") ||
          error.message ||
          t("errors.invalidCredentials");
        setFieldError(message);
        return;
      }

      onError?.(error.message || t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-xl bg-muted/50 px-3 py-2 text-sm">
        <span className="text-muted-foreground">{t("phone")}: </span>
        <span dir="ltr" className="font-medium">
          {phone}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-password">{t("password")}</Label>
        <Input
          id="auth-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldError)}
          className="h-11 rounded-full px-4"
        />
        {fieldError ? (
          <p className="text-xs text-destructive">{fieldError}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={isLoading}
          className="h-11 w-full"
        >
          {isLoading ? (
            <>
              <span
                className="size-2 animate-pulse rounded-full bg-current"
                aria-hidden
              />
              {t("actions.signingIn")}
            </>
          ) : (
            t("actions.signIn")
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 self-start"
        >
          <ArrowLeftIcon className="size-3.5 rtl:rotate-180" />
          {t("actions.changePhone")}
        </Button>
      </div>
    </form>
  );
}
