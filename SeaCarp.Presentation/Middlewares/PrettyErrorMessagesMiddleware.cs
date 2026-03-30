using SeaCarp.CrossCutting.Services.Abstractions;
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
                var logService = context.RequestServices.GetService<ILogService<Program>>();
                if (!string.IsNullOrWhiteSpace(e.StackTrace))
                {
                    logService.Error(e.StackTrace);
                }

                logService.Error(e.Message);

                var response = GenericResponse.ErrorResponse(e.Message, e.StackTrace);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = string.IsNullOrWhiteSpace(e.StackTrace) ? 400 : 500;

                await context.Response.WriteAsJsonAsync(response);
            }
        });
    }
}