using SeaCarp.Domain.Abstractions;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Middlewares;

public static class PrettyErrorMessagesMiddleware
{
    public static IApplicationBuilder UsePrettyErrorMessages(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            try
            {
                await next(context);
            }
            catch (Exception e)
            {
                var response = new GenericResponse
                {
                    Success = false,
                    ErrorMessage = e.Message,
                    StackTrace = e.StackTrace,
                };

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 200;
                await context.Response.WriteAsJsonAsync(response);
            }
        });
    }
}