using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using TimesheetBE.Helper;
using todoBE.Helper;
using todoBE.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddTransient<ExceptionHandlingMiddleware>();
builder.Services.AddDbContext<TodoContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBCS"));
});

builder.Services.AddAllServices();

builder.Services.AddCors(options =>
{
   options.AddPolicy("CORS", builder =>
   {
        builder
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials(); 
   }); 
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>(); //NEMOJ DA KORISTIS KOD KOJI NEMAS IDEJU STA RADI!
});

/*builder.Services.AddAuthentication().AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)),
                    ValidateIssuer = false, //???
                    ValidateAudience = false //????
                };
            });
*/
builder.Services.AddAuthentication("CookieAuthentication").AddCookie("CookieAuthentication", config =>
{
    //config.Cookie.SameSite = SameSiteMode.None; // Allow cross-origin cookies
    //config.Cookie.Domain = "http://localhost:5173";
    config.Cookie.Name = "MyCookie";

    config.Cookie.HttpOnly = true;
    config.Cookie.SameSite = SameSiteMode.None;
    config.Cookie.SecurePolicy = CookieSecurePolicy.Always;

    config.Events.OnRedirectToLogin = context =>
        {
            var returnUrl = context.Request.Path + context.Request.QueryString;
            throw new UnauthorizedAccessException(returnUrl + "is not authorized!");

        };


});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CORS");

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
