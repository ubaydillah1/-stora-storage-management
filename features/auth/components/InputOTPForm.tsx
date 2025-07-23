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
  DialogTrigger,
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

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function InputOTPForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <Dialog>
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
                        We&apos;ve sent a code to adrian@jsmastery.pro
                      </FormDescription>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="w-full flex gap-[6px]">
                            <InputOTPSlot
                              index={0}
                              className="h-[80px] flex-1 rounded-[12px]! text-[48px] text-primary"
                            />
                            <InputOTPSlot
                              index={1}
                              className="h-[80px] flex-1 rounded-[12px] text-[48px] text-primary"
                            />
                            <InputOTPSlot
                              index={2}
                              className="h-[80px] flex-1 rounded-[12px] text-[48px] text-primary"
                            />
                            <InputOTPSlot
                              index={3}
                              className="h-[80px] flex-1 rounded-[12px] text-[48px] text-primary"
                            />
                            <InputOTPSlot
                              index={4}
                              className="h-[80px] flex-1 rounded-[12px] text-[48px] text-primary"
                            />
                            <InputOTPSlot
                              index={5}
                              className="h-[80px] flex-1 rounded-[12px]! text-[48px] text-primary"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
