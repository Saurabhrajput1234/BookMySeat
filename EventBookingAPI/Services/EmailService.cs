using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace EventBookingAPI.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly string _apiKey;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger = null)
        {
            _configuration = configuration;
            _logger = logger;
            _apiKey = _configuration["SendGrid:ApiKey"];
            _fromEmail = _configuration["SendGrid:FromEmail"];
            _fromName = "Event Booking Platform";

            // Validate configuration
            if (string.IsNullOrEmpty(_apiKey))
            {
                _logger?.LogError("SendGrid API key is missing or empty in configuration");
                Console.WriteLine("ERROR: SendGrid API key is missing or empty in configuration");
            }

            if (string.IsNullOrEmpty(_fromEmail))
            {
                _logger?.LogError("SendGrid From Email is missing or empty in configuration");
                Console.WriteLine("ERROR: SendGrid From Email is missing or empty in configuration");
            }
        }

        public async Task<bool> SendBookingConfirmationAsync(string toEmail, string userName, string eventName, string seatInfo)
        {
            try
            {
                if (string.IsNullOrEmpty(_apiKey) || string.IsNullOrEmpty(_fromEmail))
                {
                    _logger?.LogError("Cannot send email: SendGrid configuration is incomplete");
                    Console.WriteLine("ERROR: Cannot send email: SendGrid configuration is incomplete");
                    return false;
                }

                var client = new SendGridClient(_apiKey);
                var from = new EmailAddress(_fromEmail, _fromName);
                var to = new EmailAddress(toEmail, userName);
                var subject = $"Booking Confirmation for {eventName}";
                var plainTextContent = $"Hi {userName},\nYour booking for {eventName} (Seat: {seatInfo}) is confirmed.";
                var htmlContent = $"<strong>Hi {userName},</strong><br>Your booking for <b>{eventName}</b> (Seat: {seatInfo}) is confirmed.";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                
                var response = await client.SendEmailAsync(msg);
                
                if (response.StatusCode == System.Net.HttpStatusCode.Accepted || 
                    response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    _logger?.LogInformation($"Email sent successfully to {toEmail}");
                    Console.WriteLine($"SUCCESS: Email sent successfully to {toEmail}");
                    return true;
                }
                else
                {
                    var responseBody = await response.Body.ReadAsStringAsync();
                    _logger?.LogError($"Failed to send email. Status: {response.StatusCode}, Body: {responseBody}");
                    Console.WriteLine($"ERROR: Failed to send email. Status: {response.StatusCode}, Body: {responseBody}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, $"Exception while sending booking confirmation email to {toEmail}");
                Console.WriteLine($"EXCEPTION: {ex.Message} when sending booking confirmation email to {toEmail}");
                return false;
            }
        }

        public async Task<bool> SendVerificationCodeAsync(string toEmail, string code)
        {
            try
            {
                if (string.IsNullOrEmpty(_apiKey) || string.IsNullOrEmpty(_fromEmail))
                {
                    _logger?.LogError("Cannot send verification code: SendGrid configuration is incomplete");
                    Console.WriteLine("ERROR: Cannot send verification code: SendGrid configuration is incomplete");
                    return false;
                }

                Console.WriteLine($"Attempting to send verification code to {toEmail}");
                
                var client = new SendGridClient(_apiKey);
                var from = new EmailAddress(_fromEmail, _fromName);
                var to = new EmailAddress(toEmail);
                var subject = "Email Verification Code";
                var plainTextContent = $"Your verification code is: {code}\n\nThis code will expire in 10 minutes.";
                var htmlContent = $"<html><body><h2>Your Verification Code</h2><div style='font-size:24px;font-weight:bold;padding:10px;background-color:#f0f0f0;border-radius:5px;margin:15px 0;text-align:center;'>{code}</div><p>This code will expire in 10 minutes.</p><p>If you did not request this code, please ignore this email.</p></body></html>";
                
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                
                Console.WriteLine($"Sending verification email from {_fromEmail} to {toEmail}");
                var response = await client.SendEmailAsync(msg);
                
                if (response.StatusCode == System.Net.HttpStatusCode.Accepted || 
                    response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    _logger?.LogInformation($"Verification code sent successfully to {toEmail}");
                    Console.WriteLine($"SUCCESS: Verification code sent successfully to {toEmail}");
                    return true;
                }
                else
                {
                    var responseBody = await response.Body.ReadAsStringAsync();
                    _logger?.LogError($"Failed to send verification code. Status: {response.StatusCode}, Body: {responseBody}");
                    Console.WriteLine($"ERROR: Failed to send verification code. Status: {response.StatusCode}, Body: {responseBody}");
                    Console.WriteLine($"SendGrid API Key (first 5 chars): {_apiKey.Substring(0, 5)}...");
                    Console.WriteLine($"From Email: {_fromEmail}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, $"Exception while sending verification code to {toEmail}");
                Console.WriteLine($"EXCEPTION: {ex.Message} when sending verification code to {toEmail}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"INNER EXCEPTION: {ex.InnerException.Message}");
                }
                return false;
            }
        }
    }
}