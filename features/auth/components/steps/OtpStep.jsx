"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  getFieldError,
  loginCustomer,
  requestRegisterOtp,
  verifyRegister,
} from "@/features/auth/api/customer-auth";

function getRemainingSeconds(expiresAt) {
  if (!expiresAt) return 0;
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}

function useCountdown(expiresAt) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!expiresAt) return undefined;

    const id = setInterval(() => {
      setTick((value) => value + 1);
    }, 250);

    return () => clearInterval(id);
  }, [expiresAt]);

  // `tick` drives re-renders so remaining stays fresh.
  return tick >= 0 ? getRemainingSeconds(expiresAt) : 0;
}

export default function OtpStep({
  phone,
  draft,
  debugOtp,
  expiresAt,
  onResent,
  onSuccess,
  onError,
  onBack,
}) {
  const t = useTranslations("auth");
  const [otp, setOtp] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const remaining = useCountdown(expiresAt);
  const canResend = remaining <= 0;

  const handleVerify = async (value = otp) => {
    onError?.("");
    setFieldError("");

    if (!draft) {
      onError?.(t("errors.generic"));
      return;
    }

    if (!/^\d{6}$/.test(value)) {
      setFieldError(t("errors.otpInvalid"));
      return;
    }

    setIsVerifying(true);
    try {
      const response = await verifyRegister({
        ...draft,
        otp: value,
      });

      try {
        await onSuccess(response);
        return;
      } catch {
        // verify may not return a token — sign in with the new password
      }

      const loginResponse = await loginCustomer({
        phone,
        password: draft.password,
      });
      await onSuccess(loginResponse);
    } catch (error) {
      const message =
        getFieldError(error, "otp") ||
        error.message ||
        t("errors.otpInvalid");
      setFieldError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    onError?.("");
    setFieldError("");
    setIsResending(true);

    try {
      const response = await requestRegisterOtp(phone);
      onResent?.({
        debugOtp: response?.debug_otp ?? response?.data?.debug_otp ?? null,
      });
      setOtp("");
    } catch (error) {
      onError?.(error.message || t("errors.generic"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3">
        <Label htmlFor="auth-otp" className="sr-only">
          {t("otp.code")}
        </Label>
        <InputOTP
          id="auth-otp"
          maxLength={6}
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setFieldError("");
            if (value.length === 6) {
              handleVerify(value);
            }
          }}
          autoFocus
          containerClassName="justify-center"
          aria-invalid={Boolean(fieldError)}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="size-10 text-base first:rounded-s-xl last:rounded-e-xl"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {fieldError ? (
          <p className="text-xs text-destructive">{fieldError}</p>
        ) : null}

        {debugOtp ? (
          <p className="rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
            {t("otp.debug", { code: debugOtp })}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
        {canResend ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            disabled={isResending}
            onClick={handleResend}
            className="h-auto px-0"
          >
            {isResending ? t("actions.sendingOtp") : t("otp.resend")}
          </Button>
        ) : (
          <p>{t("otp.resendIn", { seconds: remaining })}</p>
        )}
      </div>

      <Button
        type="button"
        variant="hero"
        size="lg"
        disabled={isVerifying || otp.length !== 6}
        onClick={() => handleVerify()}
        className="h-11 w-full"
      >
        {isVerifying ? (
          <>
            <span
              className="size-2 animate-pulse rounded-full bg-current"
              aria-hidden
            />
            {t("actions.verifying")}
          </>
        ) : (
          t("actions.confirmOtp")
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
        {t("actions.back")}
      </Button>
    </div>
  );
}
