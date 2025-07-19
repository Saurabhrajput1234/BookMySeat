using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EventBookingAPI.Data;
using EventBookingAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System;
using Microsoft.AspNetCore.SignalR;
using EventBookingAPI.Hubs;
using Stripe;
using EventBookingAPI.Services;

namespace EventBookingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<SeatHub> _seatHub;
        private readonly PaymentService _paymentService;
        private readonly EmailService _emailService;
        public BookingsController(ApplicationDbContext context, IHubContext<SeatHub> seatHub, PaymentService paymentService, EmailService emailService)
        {
            _context = context;
            _seatHub = seatHub;
            _paymentService = paymentService;
            _emailService = emailService;
        }

        // POST: api/bookings/book
        [HttpPost("book")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> BookSeat([FromBody] BookSeatRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            if (userId == 0) return Unauthorized();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var seat = await _context.Seats.Include(s => s.Booking).FirstOrDefaultAsync(s => s.Id == request.SeatId && s.EventId == request.EventId);
                if (seat == null) return NotFound("Seat not found.");
                if (seat.IsBooked) return BadRequest("Seat already booked.");

                seat.IsBooked = true;
                var booking = new Booking
                {
                    UserId = userId,
                    EventId = request.EventId,
                    SeatId = request.SeatId,
                    BookingTime = DateTime.UtcNow,
                    PaymentStatus = "Pending"
                };
                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();
                await _seatHub.Clients.Group($"event-{request.EventId}").SendAsync("SeatStatusUpdated", request.SeatId, true);
                await transaction.CommitAsync();
                return Ok(new { message = "Seat booked successfully.", bookingId = booking.Id });
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Booking failed due to a server error.");
            }
        }

        // GET: api/bookings/my
        [HttpGet("my")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetMyBookings()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            if (userId == 0) return Unauthorized();
            return await _context.Bookings
                .Include(b => b.Event)
                .Include(b => b.Seat)
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        // GET: api/bookings
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Event)
                .Include(b => b.Seat)
                .ToListAsync();
        }

        // POST: api/bookings/payment-intent
        [HttpPost("payment-intent")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
        {
            // For demo, assume each seat costs $20 (2000 cents)
            long amount = 2000;
            var paymentIntent = await _paymentService.CreatePaymentIntent(amount, request.Currency ?? "usd");
            return Ok(new { clientSecret = paymentIntent.ClientSecret });
        }

        // POST: api/bookings/confirm-payment
        [HttpPost("confirm-payment")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
        {
            var booking = await _context.Bookings.Include(b => b.User).Include(b => b.Event).Include(b => b.Seat).FirstOrDefaultAsync(b => b.Id == request.BookingId);
            if (booking == null) return NotFound();
            // In production, verify payment with Stripe webhook
            booking.PaymentStatus = "Paid";
            await _context.SaveChangesAsync();
            // Send email confirmation
            await _emailService.SendBookingConfirmationAsync(
                booking.User.Email,
                booking.User.Name,
                booking.Event.Name,
                $"Row {booking.Seat.Row}, Number {booking.Seat.Number}"
            );
            return Ok(new { message = "Payment confirmed, booking updated, and email sent." });
        }
    }

    public class BookSeatRequest
    {
        public int EventId { get; set; }
        public int SeatId { get; set; }
    }

    public class CreatePaymentIntentRequest
    {
        public int BookingId { get; set; }
        public string? Currency { get; set; }
    }
    public class ConfirmPaymentRequest
    {
        public int BookingId { get; set; }
        public string PaymentIntentId { get; set; }
    }
} 