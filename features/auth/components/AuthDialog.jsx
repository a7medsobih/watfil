"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { executePendingLikeIntent } from "@/features/wishlist/hooks";
import { resolveRegisterCompany } from "@/features/auth/utils/resolve-register-company";
import { useAuthDialogStore } from "@/stores/auth-dialog-store";
import { useAuthStore } from "@/stores/auth-store";

import PhoneStep from "./steps/PhoneStep";
import PasswordStep from "./steps/PasswordStep";
import RegisterStep from "./steps/RegisterStep";

/**
 * Global authentication Dialog — phone → login or direct register (+ company_id).
 */
export default function AuthDialog() {
  const t = useTranslations("auth");
  const isOpen = useAuthDialogStore((state) => state.isOpen);
  const intent = useAuthDialogStore((state) => state.intent);
  const dialogCompanyId = useAuthDialogStore((state) => state.companyId);
  const setAuthDialogOpen = useAuthDialogStore((state) => state.setAuthDialogOpen);
  const closeAuthDialog = useAuthDialogStore((state) => state.closeAuthDialog);
  const clearPendingLikeIntent = useAuthDialogStore(
    (state) => state.clearPendingLikeIntent,
  );
  const applyAuthResponse = useAuthStore((state) => state.applyAuthResponse);

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [registerCompany, setRegisterCompany] = useState(() =>
    resolveRegisterCompany(dialogCompanyId),
  );

  const resetState = () => {
    setStep("phone");
    setPhone("");
    setFormError("");
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(resetState, 200);
      return () => clearTimeout(timer);
    }
    setRegisterCompany(resolveRegisterCompany(dialogCompanyId));
    return undefined;
  }, [isOpen, dialogCompanyId]);

  const copy = useMemo(() => {
    switch (step) {
      case "password":
        return {
          title: t("login.title"),
          description: t("login.subtitle"),
        };
      case "register":
        return {
          title: t("register.title"),
          description: t("register.subtitle"),
        };
      default:
        return {
          title: intent === "register" ? t("register.title") : t("welcome.title"),
          description:
            intent === "register"
              ? t("register.phoneHint")
              : t("welcome.subtitle"),
        };
    }
  }, [step, intent, t]);

  const handleOpenChange = (open) => {
    setAuthDialogOpen(open);
    if (!open) {
      if (!useAuthStore.getState().token) {
        clearPendingLikeIntent();
      }
    }
  };

  const handleAuthenticated = async (response) => {
    const { token } = applyAuthResponse(response);
    toast.success(t("toast.success"));

    const pending = useAuthDialogStore.getState().pendingLikeIntent;
    clearPendingLikeIntent();
    closeAuthDialog();

    if (pending && token) {
      const ok = await executePendingLikeIntent(pending, token);
      if (!ok) {
        toast.error(t("errors.generic"));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[min(90dvh,720px)] gap-5 overflow-y-auto p-5 sm:max-w-md sm:p-6"
        showCloseButton
      >
        <DialogHeader className="pe-8 text-start">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {copy.title}
          </DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        {formError ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {formError}
          </p>
        ) : null}

        {step === "phone" ? (
          <PhoneStep
            initialPhone={phone}
            onChecked={({ phone: nextPhone, exists }) => {
              setFormError("");
              setPhone(nextPhone);
              setStep(exists ? "password" : "register");
            }}
            onError={setFormError}
          />
        ) : null}

        {step === "password" ? (
          <PasswordStep
            phone={phone}
            onBack={() => {
              setFormError("");
              setStep("phone");
            }}
            onSuccess={handleAuthenticated}
            onSuspended={setFormError}
            onError={setFormError}
          />
        ) : null}

        {step === "register" ? (
          <RegisterStep
            phone={phone}
            companyId={registerCompany.companyId}
            companyName={registerCompany.companyName}
            companyLocked={registerCompany.locked}
            onBack={() => {
              setFormError("");
              setStep("phone");
            }}
            onSuccess={handleAuthenticated}
            onError={setFormError}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
