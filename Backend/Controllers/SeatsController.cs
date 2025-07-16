using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EventBookingAPI.Data;
using EventBookingAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace EventBookingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SeatsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/seats/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<Seat>>> GetSeatsForEvent(int eventId)
        {
            var seats = await _context.Seats.Where(s => s.EventId == eventId).ToListAsync();
            return seats;
        }

        // POST: api/seats
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Seat>> CreateSeat(Seat seat)
        {
            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSeatsForEvent), new { eventId = seat.EventId }, seat);
        }

        // PUT: api/seats/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSeat(int id, Seat seat)
        {
            if (id != seat.Id) return BadRequest();
            _context.Entry(seat).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Seats.Any(s => s.Id == id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // DELETE: api/seats/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null) return NotFound();
            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 