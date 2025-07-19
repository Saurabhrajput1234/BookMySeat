using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace EventBookingAPI.Hubs
{
    public class SeatHub : Hub
    {
        // Called when a seat is booked or released
        public async Task BroadcastSeatStatus(int eventId, int seatId, bool isBooked)
        {
            // Notify all clients in the event group
            await Clients.Group($"event-{eventId}").SendAsync("SeatStatusUpdated", seatId, isBooked);
        }

        // Join a group for a specific event
        public async Task JoinEventGroup(int eventId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"event-{eventId}");
        }

        // Leave a group for a specific event
        public async Task LeaveEventGroup(int eventId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"event-{eventId}");
        }
    }
} 