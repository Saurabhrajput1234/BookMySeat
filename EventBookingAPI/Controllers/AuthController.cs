using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using EventBookingAPI.Models;
using EventBookingAPI.Data;
using EventBookingAPI.Services;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace EventBookingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthController(ApplicationDbContext context, JwtTokenService jwtTokenService, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _passwordHasher = passwordHasher;
        }

        // ✅ Register Endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Email already registered.");

            var role = string.IsNullOrEmpty(request.Role) ? "User" : request.Role;

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Role = role // ✅ Assign role
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Registration successful as {role}." });
        }

        // ✅ Login Endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized("Invalid credentials.");

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
}
