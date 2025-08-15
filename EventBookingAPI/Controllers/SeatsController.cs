using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EventBookingAPI.Data;
using EventBookingAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

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

        //DTO for Create Request
        public class CreateSeatDto
        {
            public int EventId { get; set; }
            public string Row { get; set; }
            public int Number { get; set; }
        }

        //DTO for Response (avoid circular reference)
        public class SeatResponseDto
        {
            public int Id { get; set; }
            public string Row { get; set; }
            public int Number { get; set; }
            public bool IsBooked { get; set; }
        }

        //Get all seats for a specific event
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<SeatResponseDto>>> GetSeatsForEvent(int eventId)
        {
            var seats = await _context.Seats
                                      .Where(s => s.EventId == eventId)
                                      .Select(s => new SeatResponseDto
                                      {
                                          Id = s.Id,
                                          Row = s.Row,
                                          Number = s.Number,
                                          IsBooked = s.IsBooked
                                      })
                                      .ToListAsync();

            return Ok(seats);
        }

        //Add a new seat (Admin only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SeatResponseDto>> CreateSeat([FromBody] CreateSeatDto seatDto)
        {
            // Validate Event existence
            var ev = await _context.Events.FindAsync(seatDto.EventId);
            if (ev == null)
                return NotFound(new { message = "Event not found" });

            var seat = new Seat
            {
                EventId = seatDto.EventId,
                Row = seatDto.Row,
                Number = seatDto.Number,
                IsBooked = false
            };

            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();

            var response = new SeatResponseDto
            {
                Id = seat.Id,
                Row = seat.Row,
                Number = seat.Number,
                IsBooked = seat.IsBooked
            };

            return CreatedAtAction(nameof(GetSeatsForEvent), new { eventId = seat.EventId }, response);
        }

        //Update an existing seat
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSeat(int id, [FromBody] CreateSeatDto seatDto)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
                return NotFound();

            seat.Row = seatDto.Row;
            seat.Number = seatDto.Number;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Delete a seat
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
                return NotFound();

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
