using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using EventBookingAPI.Models;
using EventBookingAPI.Data;
using EventBookingAPI.Services;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Collections.Concurrent;

namespace EventBookingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly EmailService _emailService;
        // In-memory store for verification codes: email -> (code, expiry)
        private static ConcurrentDictionary<string, (string Code, DateTime Expiry)> _verificationCodes = new();

        public AuthController(ApplicationDbContext context, JwtTokenService jwtTokenService, IPasswordHasher<User> passwordHasher, EmailService emailService)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _passwordHasher = passwordHasher;
            _emailService = emailService;
        }

        [HttpPost("send-verification-code")]
        public async Task<IActionResult> SendVerificationCode([FromBody] EmailRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Email is required");
            }

            Console.WriteLine($"Received verification code request for email: {request.Email}");
            var code = new Random().Next(100000, 999999).ToString();
            var expiry = DateTime.UtcNow.AddMinutes(10);
            _verificationCodes[request.Email] = (code, expiry);
            Console.WriteLine($"Generated code: {code} with expiry: {expiry}");
            
            try
            {
                Console.WriteLine($"Attempting to send verification code to: {request.Email}");
                bool emailSent = await _emailService.SendVerificationCodeAsync(request.Email, code);
                if (!emailSent)
                {
                    Console.WriteLine($"Failed to send verification code to {request.Email}");
                    return StatusCode(500, "Failed to send verification code. Please check your email address or try again later.");
                }
                
                Console.WriteLine($"Verification code sent successfully to {request.Email}");
                return Ok(new { message = "Verification code sent." });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Failed to send verification email: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                    if (ex.InnerException.InnerException != null)
                    {
                        Console.WriteLine($"Inner inner exception: {ex.InnerException.InnerException.Message}");
                    }
                }
                Console.WriteLine($"Exception stack trace: {ex.StackTrace}");
                return StatusCode(500, "Failed to send verification code. Please try again later.");
            }
        }

        [HttpPost("verify-code")]
        public IActionResult VerifyCode([FromBody] VerifyCodeRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code))
            {
                return BadRequest("Email and verification code are required");
            }

            if (_verificationCodes.TryGetValue(request.Email, out var entry))
            {
                if (entry.Expiry > DateTime.UtcNow && entry.Code == request.Code)
                {
                    // Don't remove the code yet, keep it for registration
                    return Ok(new { verified = true });
                }
                else if (entry.Expiry <= DateTime.UtcNow)
                {
                    return BadRequest("Verification code has expired. Please request a new code.");
                }
            }
            return BadRequest("Invalid verification code. Please check and try again.");
        }

        // ✅ Register Endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Email already registered.");
            // Require email verification
            if (!_verificationCodes.ContainsKey(request.Email))
                return BadRequest("Email not verified.");
            var role = string.IsNullOrEmpty(request.Role) ? "User" : request.Role;
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Role = role,
                EmailVerified = true
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            _verificationCodes.TryRemove(request.Email, out _);
            return Ok(new { message = $"Registration successful as {role}." });
        }

        // ✅ Login Endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized("Invalid credentials.");

            if (!user.IsActive)
                return Unauthorized("Your account is inactive. Please contact the administrator.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid credentials.");

            var token = _jwtTokenService.GenerateToken(user);

            // ✅ Return both token & role for frontend UI control
            return Ok(new { token, role = user.Role, name = user.Name });
        }
    }

    // ✅ DTOs
    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Role { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class EmailRequest { public string Email { get; set; } }
    public class VerifyCodeRequest { public string Email { get; set; } public string Code { get; set; } }
}
