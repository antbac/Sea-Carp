using Newtonsoft.Json;

namespace SeaCarp.Presentation.Models;

// Persisted client-side in the (non-HttpOnly) "cart" cookie so the server can
// render the mini-cart badge on every page without a round trip to the database.
public class CartToken
{
    [JsonProperty("currency")]
    public string Currency { get; set; }

    [JsonProperty("updatedUtc")]
    public DateTime UpdatedUtc { get; set; }

    // Holds either a detailed cart (List<CartLine>) or a compact quick-reorder
    // map (Dictionary<string, int> of productId -> quantity), so it is typed as
    // object and deserialized with TypeNameHandling so both shapes round-trip.
    [JsonProperty("items")]
    public object Items { get; set; }
}

public class CartLine
{
    [JsonProperty("productId")]
    public string ProductId { get; set; }

    [JsonProperty("productName")]
    public string ProductName { get; set; }

    [JsonProperty("price")]
    public decimal Price { get; set; }

    [JsonProperty("quantity")]
    public int Quantity { get; set; }
}
