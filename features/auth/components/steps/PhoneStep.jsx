"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkPhone,
  isValidEgyptianPhone,
  normalizePhone,
} from "@/features/auth/api/customer-auth";

export default function PhoneStep({ initialPhone = "", onChecked, onError }) {
  const t = useTranslations("auth");
  const [phone, setPhone] = useState(initialPhone);
  const [fieldError, setFieldError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    onError?.("");
    setFieldError("");

    const normalized = normalizePhone(phone);
    if (!isValidEgyptianPhone(normalized)) {
      setFieldError(t("errors.invalidPhone"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await checkPhone(normalized);
      const exists = Boolean(
        response?.exists ?? response?.data?.exists ?? false,
      );
      onChecked({ phone: normalized, exists });
    } catch (error) {
      onError?.(error.message || t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-phone">{t("phone")}</Label>
        <Input
          id="auth-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          autoFocus
          dir="ltr"
          placeholder={t("phonePlaceholder")}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-invalid={Boolean(fieldError)}
          className="h-11 rounded-full px-4"
        />
        {fieldError ? (
          <p className="text-xs text-destructive">{fieldError}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{t("phoneHint")}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        disabled={isLoading}
        className="h-11 w-full"
      >
        {isLoading ? (
          <>
            <Loader2Icon className="animate-spin" />
            {t("actions.checking")}
          </>
        ) : (
          t("actions.continue")
        )}
      </Button>
    </form>
  );
}
