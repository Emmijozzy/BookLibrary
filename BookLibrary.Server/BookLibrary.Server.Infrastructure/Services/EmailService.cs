using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace BookLibrary.Server.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            this.configuration = configuration;
            _logger = logger;
        }

        public async Task<RepositoryResult<bool>> SendEmailVerificationEmail(string email, string token, string userId)
        {
            try
            {
                // Create verification URL for the frontend
                var frontendUrl = configuration["AppSettings:FrontendUrl"];
                if (string.IsNullOrEmpty(frontendUrl))
                {
                    throw new InvalidOperationException("Frontend URL is not configured.");
                }
                var encodedToken = HttpUtility.UrlEncode(token);

                var verificationUrl = $"{frontendUrl}/Auth/verify-email?token={encodedToken}&userId={userId}&email={email}";

                // Use SMTP to send email without requiring paid services
                var smtpPortValue = configuration["EmailSettings:SmtpPort"];
                if (string.IsNullOrEmpty(smtpPortValue))
                {
                    throw new InvalidOperationException("SMTP port is not configured.");
                }
                int smtpPort = int.Parse(smtpPortValue);

                var enableSslValue = configuration["EmailSettings:EnableSsl"];
                if (string.IsNullOrEmpty(enableSslValue))
                {
                    throw new InvalidOperationException("EnableSsl setting is not configured.");
                }
                bool enableSsl = bool.Parse(enableSslValue);

                using (var client = new SmtpClient(configuration["EmailSettings:SmtpServer"]))
                {
                    client.Port = smtpPort;
                    client.Credentials = new NetworkCredential(
                        configuration["EmailSettings:Username"],
                        configuration["EmailSettings:Password"]);
                    client.EnableSsl = enableSsl;
                    client.Timeout = 30000; // 30 seconds timeout

                    var senderEmail = configuration["EmailSettings:SenderEmail"];
                    if (string.IsNullOrEmpty(senderEmail))
                    {
                        throw new InvalidOperationException("Sender email is not configured.");
                    }

                    var message = new MailMessage
                    {
                        From = new MailAddress(senderEmail, "BookLibrary Support"),
                        Subject = "Verify Your BookLibrary Account Email",
                        Body = $@"
                            <html>
                            <body style='font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9;'>
                                <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; border: 1px solid #dddddd;'>
                                    <div style='text-align: center; margin-bottom: 20px; padding: 10px; background-color: #4a6ee0; color: white; border-radius: 4px;'>
                                        <h2 style='margin: 0;'>BookLibrary</h2>
                                    </div>
                                    <h2 style='color: #4a6ee0; margin-top: 0;'>Email Verification</h2>
                                    <p>Hello,</p>
                                    <p>Thank you for registering with BookLibrary. Please verify your email address to complete your registration.</p>
                                    <p>Please click the button below to verify your email:</p>
                                    <div style='text-align: center; margin: 25px 0;'>
                                        <a href='{verificationUrl}' style='background-color: #4a6ee0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;'>Verify Your Email</a>
                                    </div>
                                    <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                                    <p style='word-break: break-all;'><a href='{verificationUrl}'>{verificationUrl}</a></p>
                                    <p>This link will expire in 24 hours for security reasons.</p>
                                    <p>Thank you,<br>The BookLibrary Team</p>
                                    <hr style='border: none; border-top: 1px solid #eeeeee; margin: 20px 0;'>
                                    <p style='font-size: 12px; color: #999999; text-align: center;'>This is an automated email, please do not reply.</p>
                                </div>
                            </body>
                            </html>",
                        IsBodyHtml = true
                    };

                    // Create the HTML view
                    var htmlView = AlternateView.CreateAlternateViewFromString(message.Body, null, "text/html");

                    // Create the plain text view
                    var plainTextBody = $@"
                        Email Verification

                        Hello,

                        Thank you for registering with BookLibrary. Please verify your email address to complete your registration.

                        To verify your email, please visit this link:
                        {verificationUrl}

                        This link will expire in 24 hours for security reasons.

                        Thank you,
                        The BookLibrary Team";

                    var plainTextView = AlternateView.CreateAlternateViewFromString(plainTextBody, null, "text/plain");

                    // Add both views to the message
                    message.AlternateViews.Add(htmlView);
                    message.AlternateViews.Add(plainTextView);

                    // Add these headers to improve deliverability
                    message.Headers.Add("X-Priority", "1");
                    message.Headers.Add("X-MSMail-Priority", "High");
                    message.Headers.Add("Importance", "High");
                    message.Headers.Add("X-Auto-Response-Suppress", "OOF, DR, RN, NRN, AutoReply");
                    message.Headers.Add("Auto-Submitted", "auto-generated");

                    message.To.Add(email);

                    await client.SendMailAsync(message);
                }

                return RepositoryResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                // Get the innermost exception for more details
                var innerException = ex;
                while (innerException.InnerException != null)
                {
                    innerException = innerException.InnerException;
                }

                // Log the detailed error
                _logger.LogError(ex, "Email verification sending failed: {ErrorMessage}", innerException.Message);

                return RepositoryResult<bool>.Failure($"Email verification sending failed: {innerException.Message}");
            }
        }

        public async Task<RepositoryResult<bool>> SendResetPasswordEmail(string email, string token, string userId)
        {
            try
            {
                // Create reset URL for the frontend
                var frontendUrl = configuration["AppSettings:FrontendUrl"];
                if (string.IsNullOrEmpty(frontendUrl))
                {
                    throw new InvalidOperationException("Frontend URL is not configured.");
                }

                var encodedToken = HttpUtility.UrlEncode(token);
                var resetUrl = $"{frontendUrl}/Auth/reset-password?token={encodedToken}&userId={userId}&email={email}";

                // Use SMTP to send email without requiring paid services
                var smtpPortValue = configuration["EmailSettings:SmtpPort"];
                if (string.IsNullOrEmpty(smtpPortValue))
                {
                    throw new InvalidOperationException("SMTP port is not configured.");
                }
                int smtpPort = int.Parse(smtpPortValue);

                var enableSslValue = configuration["EmailSettings:EnableSsl"];
                if (string.IsNullOrEmpty(enableSslValue))
                {
                    throw new InvalidOperationException("EnableSsl setting is not configured.");
                }
                bool enableSsl = bool.Parse(enableSslValue);

                using (var client = new SmtpClient(configuration["EmailSettings:SmtpServer"]))
                {
                    client.Port = smtpPort;
                    client.Credentials = new NetworkCredential(
                        configuration["EmailSettings:Username"],
                        configuration["EmailSettings:Password"]);
                    client.EnableSsl = enableSsl;
                    client.Timeout = 30000; // 30 seconds timeout

                    var senderEmail = configuration["EmailSettings:SenderEmail"];
                    if (string.IsNullOrEmpty(senderEmail))
                    {
                        throw new InvalidOperationException("Sender email is not configured.");
                    }

                    var message = new MailMessage
                    {
                        From = new MailAddress(senderEmail, "BookLibrary Support"),
                        Subject = "Password Reset for Your BookLibrary Account",
                        Body = $@"
                            <html>
                            <body style='font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9;'>
                                <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; border: 1px solid #dddddd;'>
                                    <div style='text-align: center; margin-bottom: 20px; padding: 10px; background-color: #4a6ee0; color: white; border-radius: 4px;'>
                                        <h2 style='margin: 0;'>BookLibrary</h2>
                                    </div>
                                    <h2 style='color: #4a6ee0; margin-top: 0;'>Password Reset Request</h2>
                                    <p>Hello,</p>
                                    <p>We received a request to reset your password for your BookLibrary account.</p>
                                    <p>Please click the button below to reset your password:</p>
                                    <div style='text-align: center; margin: 25px 0;'>
                                        <a href='{resetUrl}' style='background-color: #4a6ee0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;'>Reset Your Password</a>
                                    </div>
                                    <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                                    <p style='word-break: break-all;'><a href='{resetUrl}'>{resetUrl}</a></p>
                                    <p>If you didn't request a password reset, you can safely ignore this email.</p>
                                    <p>This link will expire in 24 hours for security reasons.</p>
                                    <p>Thank you,<br>The BookLibrary Team</p>
                                    <hr style='border: none; border-top: 1px solid #eeeeee; margin: 20px 0;'>
                                    <p style='font-size: 12px; color: #999999; text-align: center;'>This is an automated email, please do not reply.</p>
                                </div>
                            </body>
                            </html>",
                        IsBodyHtml = true
                    };

                    // Create the HTML view
                    var htmlView = AlternateView.CreateAlternateViewFromString(message.Body, null, "text/html");

                    // Create the plain text view
                    var plainTextBody = $@"
                        Password Reset Request

                        Hello,

                        We received a request to reset your password for your BookLibrary account.

                        To reset your password, please visit this link:
                        {resetUrl}

                        If you didn't request a password reset, you can safely ignore this email.
                        This link will expire in 24 hours for security reasons.

                        Thank you,
                        The BookLibrary Team";

                    var plainTextView = AlternateView.CreateAlternateViewFromString(plainTextBody, null, "text/plain");

                    // Add both views to the message
                    message.AlternateViews.Add(htmlView);
                    message.AlternateViews.Add(plainTextView);

                    // Add these headers to improve deliverability
                    message.Headers.Add("X-Priority", "1");
                    message.Headers.Add("X-MSMail-Priority", "High");
                    message.Headers.Add("Importance", "High");
                    message.Headers.Add("X-Auto-Response-Suppress", "OOF, DR, RN, NRN, AutoReply");
                    message.Headers.Add("Auto-Submitted", "auto-generated");

                    message.To.Add(email);

                    await client.SendMailAsync(message);
                }

                return RepositoryResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                // Get the innermost exception for more details
                var innerException = ex;
                while (innerException.InnerException != null)
                {
                    innerException = innerException.InnerException;
                }

                // Log the detailed error
                _logger.LogError(ex, "Email sending failed: {ErrorMessage}", innerException.Message);

                return RepositoryResult<bool>.Failure($"Email sending failed: {innerException.Message}");
            }
        }
    }
}
