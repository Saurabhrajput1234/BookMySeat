using Microsoft.Extensions.Configuration;
using Stripe;
using System.Threading.Tasks;

namespace EventBookingAPI.Services
{
    public class PaymentService
    {
        private readonly IConfiguration _configuration;
        public PaymentService(IConfiguration configuration)
        {
            _configuration = configuration;
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
        }

        public async Task<PaymentIntent> CreatePaymentIntent(long amount, string currency = "usd")
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = currency,
                PaymentMethodTypes = new List<string> { "card" },
            };
            var service = new PaymentIntentService();
            return await service.CreateAsync(options);
        }
    }
} 