"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormScheme } from "../types/auth-types";
import { authFormScheme } from "../schemas/auth-scheme";
import Link from "next/link";
import { InputOTPForm } from "./InputOTPForm";
import { loginUser, registerUser } from "../services";
import { useRouter } from "next/navigation";

const AuthForm = ({ type }: { type: FormScheme }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailForOtp, setEmailForOtp] = useState<string>("");
  const [showOtpDialog, setShowOtpDialog] = useState<boolean>(false);
  const router = useRouter();
  const formSchema = authFormScheme(type);

  const handleOtpDialogClose = () => {
    setShowOtpDialog(false);
  };

  useEffect(() => {
    const time = setTimeout(() => {
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(time);
  }, [errorMessage]);

  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "register" && { username: "", confirmPassword: "" }),
    },
  });

  const onSubmit = async (value: FormSchemaType) => {
    setIsLoading(true);

    if (type === "register") {
      const result = await registerUser(value);

      if (!result.success) {
        setErrorMessage(result.error.message);
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
      } else {
        setEmailForOtp(value.email);
        setShowOtpDialog(true);
        form.reset();
      }
    }

    if (type === "login") {
      const result = await loginUser(value);

      if (!result.success) {
        if (result.error.code === "USER_NOT_VERIFIED") {
          setEmailForOtp(value.email);
          setShowOtpDialog(true);
          form.reset();
          setIsLoading(false);
          return;
        }

        form.setValue("password", "");
        setErrorMessage(result.error.message);
      } else {
        router.push("/");
        localStorage.setItem("a", result.data.accessToken);
        form.reset();
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full h-screen flex-center p-[20px] md:p-[60px]">
      <div className="lg:max-w-[580px] w-full flex flex-col gap-[24px]">
        <h1 className="h1 text-center lg:text-left">
          {type === "login" ? "Login" : "Register"}
        </h1>

        {type === "login" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              autoComplete="on"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errorMessage && (
                <p className="text-white text-center text-[14px] bg-destructive py-3 rounded-[12px] animate-pulse">
                  {errorMessage}
                </p>
              )}
              <Button type="submit" size="full" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        )}

        {type === "register" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              autoComplete="on"
              action={"/register"}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Due"
                        {...field}
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errorMessage && (
                <p className="text-white text-center text-[14px] bg-destructive py-3 rounded-[12px] animate-pulse">
                  {errorMessage}
                </p>
              )}
              <Button type="submit" size="full" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        )}

        <p className="text-center body2">
          {type === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            href={type === "login" ? "/register" : "/login"}
            className="text-primary"
          >
            {type === "login" ? "Register" : "Login"}
          </Link>
        </p>

        <InputOTPForm
          isOpen={showOtpDialog}
          onClose={handleOtpDialogClose}
          email={emailForOtp}
        />
      </div>
    </div>
  );
};

export default AuthForm;
