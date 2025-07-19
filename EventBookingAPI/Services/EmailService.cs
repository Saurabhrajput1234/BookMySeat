using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace EventBookingAPI.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendBookingConfirmationAsync(string toEmail, string userName, string eventName, string seatInfo)
        {
            var apiKey = _configuration["SendGrid:ApiKey"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(_configuration["SendGrid:FromEmail"], "Event Booking Platform");
            var to = new EmailAddress(toEmail, userName);
            var subject = $"Booking Confirmation for {eventName}";
            var plainTextContent = $"Hi {userName},\nYour booking for {eventName} (Seat: {seatInfo}) is confirmed.";
            var htmlContent = $"<strong>Hi {userName},</strong><br>Your booking for <b>{eventName}</b> (Seat: {seatInfo}) is confirmed.";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await client.SendEmailAsync(msg);
        }
    }
} 