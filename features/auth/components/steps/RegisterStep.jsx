"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import { mapCompanies, mapGovernorates } from "@/features/companies/services/company.mapper";
import {
  getFieldError,
  registerCustomer,
} from "@/features/auth/api/customer-auth";

/**
 * Direct register with company_id (creates customer_company_links).
 * OTP verify does not support company_id — do not use it for order-ready accounts.
 */
export default function RegisterStep({
  phone,
  companyId: initialCompanyId = null,
  companyName: initialCompanyName = null,
  companyLocked = false,
  onBack,
  onSuccess,
  onError,
}) {
  const t = useTranslations("auth");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [companyId, setCompanyId] = useState(
    initialCompanyId != null ? String(initialCompanyId) : "",
  );
  const [referralCode, setReferralCode] = useState("");
  const [governorates, setGovernorates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingGovernorates, setLoadingGovernorates] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(!companyLocked);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialCompanyId != null && initialCompanyId !== "") {
      setCompanyId(String(initialCompanyId));
    }
  }, [initialCompanyId]);

  useEffect(() => {
    let cancelled = false;

    async function loadGovernorates() {
      setLoadingGovernorates(true);
      try {
        const response = await fetchFromAPI(endpoints.governorates.list, {
          cache: "no-store",
        });
        const mapped = mapGovernorates(response?.data ?? [], locale);
        if (!cancelled) setGovernorates(mapped);
      } catch {
        if (!cancelled) setGovernorates([]);
      } finally {
        if (!cancelled) setLoadingGovernorates(false);
      }
    }

    loadGovernorates();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    if (companyLocked) {
      setLoadingCompanies(false);
      return undefined;
    }

    let cancelled = false;

    async function loadCompanies() {
      setLoadingCompanies(true);
      try {
        const params = { page: 1, per_page: 100 };
        if (governorateId) params.governorate_id = governorateId;
        const response = await fetchFromAPI(endpoints.companies.list, {
          params,
          cache: "no-store",
        });
        const mapped = mapCompanies(response?.data ?? [], locale);
        if (!cancelled) setCompanies(mapped);
      } catch {
        if (!cancelled) setCompanies([]);
      } finally {
        if (!cancelled) setLoadingCompanies(false);
      }
    }

    loadCompanies();
    return () => {
      cancelled = true;
    };
  }, [locale, governorateId, companyLocked]);

  const validate = () => {
    const next = {};

    if (!name.trim()) next.name = t("errors.nameRequired");
    if (!password || password.length < 8) {
      next.password = t("errors.passwordMin");
    }
    if (password !== passwordConfirmation) {
      next.password_confirmation = t("errors.passwordMismatch");
    }
    if (!governorateId) next.governorate_id = t("errors.governorateRequired");
    if (!companyId) next.company_id = t("errors.companyRequired");

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onError?.("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await registerCustomer({
        phone,
        password,
        password_confirmation: passwordConfirmation,
        full_name: name.trim(),
        governorate_id: Number(governorateId),
        company_id: Number(companyId),
        referral_code: referralCode.trim() || undefined,
      });
      await onSuccess?.(response);
    } catch (error) {
      if (error?.message === "company_id_required") {
        onError?.(t("errors.companyRequired"));
        return;
      }
      const apiField =
        getFieldError(error, "phone") ||
        getFieldError(error, "full_name") ||
        getFieldError(error, "name") ||
        getFieldError(error, "password") ||
        getFieldError(error, "company_id") ||
        getFieldError(error, "governorate_id");
      onError?.(apiField || error.message || t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const lockedCompanyLabel =
    initialCompanyName ||
    companies.find((c) => String(c.id) === String(companyId))?.name ||
    (companyId ? `#${companyId}` : null);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div className="rounded-xl bg-muted/50 px-3 py-2 text-sm">
        <span className="text-muted-foreground">{t("phone")}: </span>
        <span dir="ltr" className="font-medium">
          {phone}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-name">{t("name")}</Label>
        <Input
          id="auth-name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          className="h-11 rounded-full px-4"
        />
        {fieldErrors.name ? (
          <p className="text-xs text-destructive">{fieldErrors.name}</p>
        ) : null}
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="auth-new-password">{t("password")}</Label>
          <Input
            id="auth-new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            className="h-11 rounded-full px-4"
          />
          {fieldErrors.password ? (
            <p className="text-xs text-destructive">{fieldErrors.password}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="auth-confirm-password">{t("confirmPassword")}</Label>
          <Input
            id="auth-confirm-password"
            type="password"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            aria-invalid={Boolean(fieldErrors.password_confirmation)}
            className="h-11 rounded-full px-4"
          />
          {fieldErrors.password_confirmation ? (
            <p className="text-xs text-destructive">
              {fieldErrors.password_confirmation}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-governorate">{t("governorate")}</Label>
        <Select
          value={governorateId || undefined}
          onValueChange={(next) => {
            setGovernorateId(next);
            if (!companyLocked) setCompanyId("");
          }}
          disabled={loadingGovernorates}
        >
          <SelectTrigger
            id="auth-governorate"
            className="h-11 rounded-full px-4"
            aria-invalid={Boolean(fieldErrors.governorate_id)}
          >
            <SelectValue
              placeholder={
                loadingGovernorates
                  ? t("actions.loading")
                  : t("governoratePlaceholder")
              }
            />
          </SelectTrigger>
          <SelectContent>
            {governorates.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.governorate_id ? (
          <p className="text-xs text-destructive">
            {fieldErrors.governorate_id}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-company">{t("company")}</Label>
        <p className="text-xs text-muted-foreground">{t("companyHint")}</p>
        {companyLocked && companyId ? (
          <div
            id="auth-company"
            className="flex h-11 items-center rounded-full border border-border/60 bg-muted/40 px-4 text-sm font-medium"
          >
            {lockedCompanyLabel}
          </div>
        ) : (
          <Select
            value={companyId || undefined}
            onValueChange={setCompanyId}
            disabled={loadingCompanies}
          >
            <SelectTrigger
              id="auth-company"
              className="h-11 rounded-full px-4"
              aria-invalid={Boolean(fieldErrors.company_id)}
            >
              <SelectValue
                placeholder={
                  loadingCompanies
                    ? t("actions.loading")
                    : t("companyPlaceholder")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {companies.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {fieldErrors.company_id ? (
          <p className="text-xs text-destructive">{fieldErrors.company_id}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-referral">
          {t("referralCode")}{" "}
          <span className="font-normal text-muted-foreground">
            ({t("optional")})
          </span>
        </Label>
        <Input
          id="auth-referral"
          value={referralCode}
          onChange={(event) => setReferralCode(event.target.value)}
          className="h-11 rounded-full px-4"
          dir="ltr"
        />
      </div>

      <div className="flex flex-col gap-2 pt-1">
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
              {t("actions.creatingAccount")}
            </>
          ) : (
            t("actions.createAccount")
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
