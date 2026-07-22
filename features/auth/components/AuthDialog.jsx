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
import { useAuthDialogStore } from "@/stores/auth-dialog-store";
import { useAuthStore } from "@/stores/auth-store";

import PhoneStep from "./steps/PhoneStep";
import PasswordStep from "./steps/PasswordStep";
import RegisterStep from "./steps/RegisterStep";
import OtpStep from "./steps/OtpStep";

const OTP_COUNTDOWN_SECONDS = 60;

/**
 * Global authentication Dialog — phone → login or register+OTP.
 */
export default function AuthDialog() {
  const t = useTranslations("auth");
  const isOpen = useAuthDialogStore((state) => state.isOpen);
  const intent = useAuthDialogStore((state) => state.intent);
  const setAuthDialogOpen = useAuthDialogStore((state) => state.setAuthDialogOpen);
  const closeAuthDialog = useAuthDialogStore((state) => state.closeAuthDialog);
  const applyAuthResponse = useAuthStore((state) => state.applyAuthResponse);

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [registerDraft, setRegisterDraft] = useState(null);
  const [debugOtp, setDebugOtp] = useState(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [formError, setFormError] = useState("");

  const resetState = () => {
    setStep("phone");
    setPhone("");
    setRegisterDraft(null);
    setDebugOtp(null);
    setOtpExpiresAt(null);
    setFormError("");
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(resetState, 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

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
      case "otp":
        return {
          title: t("otp.title"),
          description: t("otp.subtitle", { phone }),
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
  }, [step, intent, phone, t]);

  const handleAuthenticated = (response) => {
    applyAuthResponse(response);
    toast.success(t("toast.success"));
    closeAuthDialog();
  };

  const startOtpCountdown = () => {
    setOtpExpiresAt(Date.now() + OTP_COUNTDOWN_SECONDS * 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setAuthDialogOpen}>
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
            onBack={() => {
              setFormError("");
              setStep("phone");
            }}
            onOtpSent={({ draft, debugOtp: nextDebugOtp }) => {
              setFormError("");
              setRegisterDraft(draft);
              setDebugOtp(nextDebugOtp ?? null);
              startOtpCountdown();
              setStep("otp");
            }}
            onError={setFormError}
          />
        ) : null}

        {step === "otp" ? (
          <OtpStep
            phone={phone}
            draft={registerDraft}
            debugOtp={debugOtp}
            expiresAt={otpExpiresAt}
            onResent={({ debugOtp: nextDebugOtp }) => {
              setDebugOtp(nextDebugOtp ?? null);
              startOtpCountdown();
            }}
            onSuccess={handleAuthenticated}
            onError={setFormError}
            onBack={() => {
              setFormError("");
              setStep("register");
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
