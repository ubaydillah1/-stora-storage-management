import { prisma } from "@/lib/prisma";
import { generateRandomNumber } from "@/lib/utils";
import { User } from "@prisma/client";
import nodemailer from "nodemailer";
import { SendOtpTemplate } from "../emailTemplates/templates";

export const sendOTP = async (user: User) => {
  const randomNumber = generateRandomNumber();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      otp: randomNumber,
      expiredOTP: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_SENDER!,
      pass: process.env.GMAIL_PASSWORD!,
    },
  });

  await transporter.sendMail({
    from: "<cyberlast155@gmail.com>",
    to: user.email,
    subject: "Your OTP Verification Code",
    text: "OTP Code",
    html: SendOtpTemplate({
      otp: randomNumber,
      username: user.username,
    }),
  });
};
