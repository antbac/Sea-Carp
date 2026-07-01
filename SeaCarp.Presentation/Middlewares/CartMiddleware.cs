using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SeaCarp.CrossCutting.Config;
using SeaCarp.Presentation.Models;

namespace SeaCarp.Presentation.Middlewares;

public static class CartMiddleware
{
    // Reads the client-managed "cart" cookie on every request and exposes the
    // number of lines to the layout so the navbar mini-cart badge can be
    // rendered server-side instead of relying purely on client script.
    public static IApplicationBuilder UseCart(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            if (context.Request.Cookies.TryGetValue(Constants.CartCookieName, out var raw) &&
                !string.IsNullOrWhiteSpace(raw))
            {
                try
                {
                    var json = Uri.UnescapeDataString(raw);

                    var cart = JsonConvert.DeserializeObject<CartToken>(json, new JsonSerializerSettings
                    {
                        TypeNameHandling = TypeNameHandling.Auto,
                    });

                    context.Items[Constants.CartItemCountKey] = CountItems(cart);
                }
                catch
                {
                    // A malformed cart cookie should never take a page down.
                }
            }

            await next(context);
        });
    }

    private static int CountItems(CartToken cart)
    {
        return cart?.Items switch
        {
            JArray lines => lines.Count,
            JObject map => map.Count,
            _ => 0,
        };
    }
}
