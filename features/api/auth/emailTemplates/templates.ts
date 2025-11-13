export const SendOtpTemplate = ({
  username,
  otp,
}: {
  username: string;
  otp: string;
}) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
  .header { background-color: #f8f8f8; padding: 10px 0; text-align: center; border-bottom: 1px solid #eee; }
  .otp-code { font-size: 2em; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; padding: 10px; border: 2px dashed #007bff; border-radius: 5px; display: inline-block; }
  .footer { font-size: 0.8em; color: #777; text-align: center; margin-top: 20px; }
  .warning { color: #dc3545; font-weight: bold; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Verify Your Account</h2>
    </div>
    <p>Hello ${username || "User"},</p>
    <p>Thank you for using our service.</p>
    <p>Please use the following verification code to proceed:</p>
    <div style="text-align: center;">
      <span class="otp-code">${otp}</span>
    </div>
    <p><span class="warning">Important:</span> This code is valid for **5 minutes**. Please do not share this code with anyone, including our staff.</p>
    <p>If you did not request this code, please disregard this email.</p>
    <p>Sincerely,<br>
    The Stora Team</p>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Stora. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`;
