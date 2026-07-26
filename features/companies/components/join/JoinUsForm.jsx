"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2Icon } from "lucide-react";

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
import { getFieldError } from "@/features/auth/api/customer-auth";
import { createCompanyJoinRequest } from "@/features/companies/api/create-company-join-request";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const FIELD_KEYS = [
  "company_name",
  "tax_number",
  "governorate_id",
  "contact_name",
  "phone",
  "email",
  "notes",
];

const inputClassName = "h-11 rounded-full px-4";

/**
 * @param {object} props
 * @param {{ id: number|string, name: string }[]} props.governorates
 */
export default function JoinUsForm({ governorates = [] }) {
  const t = useTranslations("joinUs");
  const formId = useId();

  const [companyName, setCompanyName] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setFormError("");
    setFieldErrors({});
    setIsLoading(true);

    const payload = {
      company_name: companyName.trim(),
      tax_number: taxNumber.trim(),
      governorate_id: Number(governorateId),
      contact_name: contactName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    try {
      const response = await createCompanyJoinRequest(payload);
      setSuccessMessage(
        response?.message || t("success.description"),
      );
    } catch (error) {
      if (error?.status === 422) {
        const next = {};
        for (const key of FIELD_KEYS) {
          const message = getFieldError(error, key);
          if (message) next[key] = message;
        }
        setFieldErrors(next);
        if (Object.keys(next).length === 0) {
          setFormError(error.message || t("errors.generic"));
        }
      } else {
        setFormError(error?.message || t("errors.generic"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div
        className="rounded-3xl border border-border/60 px-6 py-12 text-center sm:px-10 sm:py-14"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary sm:size-18">
          <CheckCircle2 className="size-8 sm:size-9" aria-hidden />
        </div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t("success.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {successMessage}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="hero" size="lg" className="h-11 px-6" asChild>
            <Link href="/">{t("actions.backHome")}</Link>
          </Button>
          <Button variant="outline" size="lg" className="h-11 px-6" asChild>
            <Link href="/companies">{t("actions.browseCompanies")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      aria-busy={isLoading}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-company-name`}
          label={t("fields.companyName")}
          error={fieldErrors.company_name}
          required
        >
          <Input
            id={`${formId}-company-name`}
            name="company_name"
            autoComplete="organization"
            value={companyName}
            onChange={(event) => {
              setCompanyName(event.target.value);
              clearFieldError("company_name");
            }}
            disabled={isLoading}
            required
            aria-invalid={Boolean(fieldErrors.company_name)}
            aria-describedby={
              fieldErrors.company_name
                ? `${formId}-company-name-error`
                : undefined
            }
            className={inputClassName}
          />
        </Field>

        <Field
          id={`${formId}-tax-number`}
          label={t("fields.taxNumber")}
          error={fieldErrors.tax_number}
          required
        >
          <Input
            id={`${formId}-tax-number`}
            name="tax_number"
            value={taxNumber}
            onChange={(event) => {
              setTaxNumber(event.target.value);
              clearFieldError("tax_number");
            }}
            disabled={isLoading}
            required
            dir="ltr"
            aria-invalid={Boolean(fieldErrors.tax_number)}
            aria-describedby={
              fieldErrors.tax_number
                ? `${formId}-tax-number-error`
                : undefined
            }
            className={inputClassName}
          />
        </Field>
      </div>

      <Field
        id={`${formId}-governorate`}
        label={t("fields.governorate")}
        error={fieldErrors.governorate_id}
        required
      >
        <Select
          value={governorateId || undefined}
          onValueChange={(value) => {
            setGovernorateId(value);
            clearFieldError("governorate_id");
          }}
          disabled={isLoading || governorates.length === 0}
        >
          <SelectTrigger
            id={`${formId}-governorate`}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.governorate_id)}
            aria-describedby={
              fieldErrors.governorate_id
                ? `${formId}-governorate-error`
                : undefined
            }
          >
            <SelectValue placeholder={t("fields.governoratePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {governorates.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-contact-name`}
          label={t("fields.contactName")}
          error={fieldErrors.contact_name}
          required
        >
          <Input
            id={`${formId}-contact-name`}
            name="contact_name"
            autoComplete="name"
            value={contactName}
            onChange={(event) => {
              setContactName(event.target.value);
              clearFieldError("contact_name");
            }}
            disabled={isLoading}
            required
            aria-invalid={Boolean(fieldErrors.contact_name)}
            aria-describedby={
              fieldErrors.contact_name
                ? `${formId}-contact-name-error`
                : undefined
            }
            className={inputClassName}
          />
        </Field>

        <Field
          id={`${formId}-phone`}
          label={t("fields.phone")}
          error={fieldErrors.phone}
          required
        >
          <Input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              clearFieldError("phone");
            }}
            disabled={isLoading}
            required
            dir="ltr"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={
              fieldErrors.phone ? `${formId}-phone-error` : undefined
            }
            className={inputClassName}
          />
        </Field>
      </div>

      <Field
        id={`${formId}-email`}
        label={t("fields.email")}
        error={fieldErrors.email}
        required
      >
        <Input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearFieldError("email");
          }}
          disabled={isLoading}
          required
          dir="ltr"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email ? `${formId}-email-error` : undefined
          }
          className={inputClassName}
        />
      </Field>

      <Field
        id={`${formId}-notes`}
        label={
          <>
            {t("fields.notes")}{" "}
            <span className="font-normal text-muted-foreground">
              ({t("fields.optional")})
            </span>
          </>
        }
        error={fieldErrors.notes}
      >
        <textarea
          id={`${formId}-notes`}
          name="notes"
          rows={4}
          maxLength={1000}
          value={notes}
          onChange={(event) => {
            setNotes(event.target.value);
            clearFieldError("notes");
          }}
          disabled={isLoading}
          aria-invalid={Boolean(fieldErrors.notes)}
          aria-describedby={
            fieldErrors.notes ? `${formId}-notes-error` : undefined
          }
          className={cn(
            "w-full resize-y rounded-2xl border border-input bg-transparent px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
          )}
        />
      </Field>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="hero"
        size="lg"
        disabled={isLoading}
        className="h-11 w-full sm:w-auto sm:min-w-48"
      >
        {isLoading ? (
          <>
            <Loader2Icon className="animate-spin" aria-hidden />
            {t("actions.submitting")}
          </>
        ) : (
          t("actions.submit")
        )}
      </Button>
    </form>
  );
}

function Field({ id, label, error, required, children }) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
