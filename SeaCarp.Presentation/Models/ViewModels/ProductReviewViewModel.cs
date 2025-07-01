using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class ProductReviewViewModel(Api.v1.ProductReview productReview)
{
    public HtmlString User { get; private set; } = new(string.IsNullOrWhiteSpace(productReview?.User) ? string.Empty : productReview.User);
    public int Rating { get; private set; } = productReview?.Rating ?? default;
    public HtmlString Comment { get; private set; } = new(string.IsNullOrWhiteSpace(productReview?.Comment) ? string.Empty : productReview.Comment);
    public HtmlString CreatedDate { get; private set; } = new((productReview?.CreatedDate ?? default).ToString("yyyy-MM-dd HH:mm:ss"));
}