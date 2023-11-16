using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace todoBE.Helper;

public class ExceptionHandlingMiddleware : IMiddleware
{
    public ExceptionHandlingMiddleware()
    {

    }
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            /*if (!context!.User!.Identity!.IsAuthenticated) //Don't do this with public endpoints
            {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Unauthorized access. Please log in.");
            return;
            }*/

            await next(context);
        }
        catch (ValidationException ve)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

            ProblemDetails problem = new()
            {
                Status = context.Response.StatusCode,
                Type = "Validation error",
                Title = "Validation error",
                Detail = ve.Message
            };

            var jsonRes = JsonSerializer.Serialize(problem);

            await context.Response.WriteAsync(jsonRes);

        }
        catch (NullReferenceException ne)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.Conflict;

            ProblemDetails problem = new()
            {
                Status = context.Response.StatusCode,
                Type = "Not found error",
                Title = "Not found error",
                Detail = ne.Message
            };

            var jsonRes = JsonSerializer.Serialize(problem);

            await context.Response.WriteAsync(jsonRes);

        }

        catch(UnauthorizedAccessException uae)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            ProblemDetails problem = new()
            {
                Status = context.Response.StatusCode,
                Type = "Unauthorized error",
                Title = "Unauthorized error",
                Detail = uae.Message
            };

            var jsonRes = JsonSerializer.Serialize(problem);

            await context.Response.WriteAsync(jsonRes);

        }
        catch(ForbiddenException fe)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status403Forbidden;

            ProblemDetails problem = new()
            {
                Status = context.Response.StatusCode,
                Type = "Forbidden error",
                Title = "Forbidden error",
                Detail = fe.Message
            };

            var jsonRes = JsonSerializer.Serialize(problem);

            await context.Response.WriteAsync(jsonRes);

        }

        catch (Exception e)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            ProblemDetails problem = new()
            {
                Status = context.Response.StatusCode,
                Type = "Other error",
                Title = "Other error",
                Detail = e.Message
            };

            var jsonRes = JsonSerializer.Serialize(problem);

            await context.Response.WriteAsync(jsonRes);

        }
    }
}