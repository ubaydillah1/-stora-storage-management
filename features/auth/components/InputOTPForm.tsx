"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { resendOtp, verifyOtp } from "../services";
import { COOLDOWN_SECONDS } from "../constants";
import { Error, InputOTPFormProps } from "../types/auth-types";
import { useRouter } from "next/navigation";
import { otpScheme } from "../schemas/auth-scheme";

type OtpScheme = z.infer<typeof otpScheme>;

export function InputOTPForm({ isOpen, onClose, email }: InputOTPFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const timestamp = localStorage.getItem("otpCooldownTimestamp");
    if (timestamp) {
      const timePassed = (Date.now() - parseInt(timestamp)) / 1000;
      if (timePassed < COOLDOWN_SECONDS) {
        setCooldown(Math.round(COOLDOWN_SECONDS - timePassed));
      } else {
        localStorage.removeItem("otpCooldownTimestamp");
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const form = useForm<OtpScheme>({
    resolver: zodResolver(otpScheme),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data: OtpScheme) => {
    setIsLoading(true);
    form.clearErrors("pin");

    try {
      const result = await verifyOtp({ email, otp: data.pin });

      if (!result.success) {
        form.setError("pin", {
          type: "custom",
          message: result.error?.message ?? "Unknown error",
        });

        form.setValue("pin", "");
        return;
      }

      localStorage.setItem("a", result.data.accessToken);

      router.push("/");
    } catch (error) {
      form.setError("pin", {
        type: "custom",
        message: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtpSubmit = async () => {
    setIsResending(true);

    try {
      await resendOtp({ email });
      toast.success(`New OTP has been sent to ${email}`);

      localStorage.setItem("otpCooldownTimestamp", Date.now().toString());
      setCooldown(COOLDOWN_SECONDS);

      form.reset();
    } catch (error) {
      form.setError("pin", {
        type: "custom",
        message: (error as Error).message,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value: string) => {
    if (value.length === 6) {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center h2">Enter OTP</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex space-y-6 w-full flex-col"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="text-center w-full">
                    <FormDescription className="body2">
                      We&apos;ve sent a code to{" "}
                      <span className="text-primary">{email}</span>
                    </FormDescription>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        onChange={(val) => {
                          field.onChange(val);
                          handleOtpChange(val);
                        }}
                        inputMode="tel"
                      >
                        <InputOTPGroup className="w-full flex gap-[6px]">
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-[80px] flex-1 rounded-[12px]! text-[48px] text-primary"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Submit"}
              </Button>
            </form>
          </Form>

          <div className="text-center body2 my-2 text-muted-foreground">
            {cooldown > 0 ? (
              <span>Resend OTP again in {cooldown}s ⏳</span>
            ) : (
              <span>
                Don’t get OTP Code?{" "}
                <span
                  className={`text-primary underline ${
                    isResending
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  onClick={isResending ? undefined : resendOtpSubmit}
                >
                  {isResending ? "Sending..." : "Resend OTP Code"}
                </span>
              </span>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
