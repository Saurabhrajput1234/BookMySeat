using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EventBookingAPI.Data;
using EventBookingAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace EventBookingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // ✅ Admin only
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/users - List all users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.IsActive
                })
                .ToListAsync();

            return Ok(users);
        }

        // ✅ GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.IsActive
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        // ✅ PUT: api/users/{id}/role - Update user role
        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            if (dto.Role != "Admin" && dto.Role != "User")
                return BadRequest(new { message = "Invalid role" });
            user.Role = dto.Role;
            await _context.SaveChangesAsync();
            return Ok(new { message = "User role updated successfully" });
        }

        public class UpdateUserRoleDto
        {
            public string Role { get; set; }
        }
        // ✅ PUT: api/users/{id}/active - Toggle user active/inactive
        public class ToggleUserActiveDto
        {
            public bool IsActive { get; set; }
        }

        [HttpPut("{id}/active")]
        public async Task<IActionResult> ToggleUserActive(int id, [FromBody] ToggleUserActiveDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            user.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new { message = "User status updated successfully" });
        }
    }
}
