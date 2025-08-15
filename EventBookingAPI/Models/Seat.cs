using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EventBookingAPI.Models
{
    public class Seat
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EventId { get; set; }

        [ForeignKey("EventId")]
        [JsonIgnore] 
        public Event Event { get; set; }

        [Required]
        public string Row { get; set; }

        [Required]
        public int Number { get; set; }

        public bool IsBooked { get; set; }

        [JsonIgnore] 
        public Booking? Booking { get; set; }
    }
}
