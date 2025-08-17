using EventBookingAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database (PostgreSQL)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Event Booking API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Controllers + JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            builder.Configuration["FrontendUrl"] ?? "http://localhost:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddSingleton<EventBookingAPI.Services.JwtTokenService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = jwtSettings["Key"];
    if (string.IsNullOrEmpty(key))
    {
        throw new InvalidOperationException("JWT key is missing in configuration.");
    }

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            IsBase64String(key) ? Convert.FromBase64String(key) : Encoding.UTF8.GetBytes(key)
        ),
        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"JWT Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("JWT Token validated successfully.");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Identity password hasher
builder.Services.AddSingleton<
    Microsoft.AspNetCore.Identity.IPasswordHasher<EventBookingAPI.Models.User>,
    Microsoft.AspNetCore.Identity.PasswordHasher<EventBookingAPI.Models.User>
>();

// SignalR + other services
builder.Services.AddSignalR();
builder.Services.AddSingleton<EventBookingAPI.Services.PaymentService>();
builder.Services.AddSingleton<EventBookingAPI.Services.EmailService>();

var app = builder.Build();

// Swagger in all environments (including production)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Event Booking API v1");
    c.RoutePrefix = "swagger"; // Available at /swagger
    c.DocumentTitle = "Event Booking API Documentation";
    
    // Optional: Add some styling for production
    if (!app.Environment.IsDevelopment())
    {
        c.DefaultModelsExpandDepth(-1); // Hide models section in production
    }
});

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<EventBookingAPI.Hubs.SeatHub>("/seathub");

app.Run();

// Helper method to check if string is Base64
static bool IsBase64String(string base64)
{
    if (string.IsNullOrEmpty(base64))
        return false;

    try
    {
        Convert.FromBase64String(base64);
        return true;
    }
    catch (FormatException)
    {
        return false;
    }
}
