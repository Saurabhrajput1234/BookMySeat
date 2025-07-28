namespace EventBookingAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User"; // Default role is User

        public bool IsActive { get; set; } = true; //  New property

        public bool EmailVerified { get; set; } = false; // Email verification status
    }
}
