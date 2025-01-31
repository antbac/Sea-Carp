using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class ProductReviewViewModel
{
    public HtmlString User { get; set; }
    public int Rating { get; set; }
    public HtmlString Comment { get; set; }
    public HtmlString CreatedDate { get; set; }

    public ProductReviewViewModel(Domain.Models.Review review = null)
    {
        if (review is null)
        {
            User = new(string.Empty);
            Comment = new(string.Empty);
            CreatedDate = new(string.Empty);
            return;
        }

        User = new(review.User);
        Rating = review.Rating;
        Comment = new(review.Comment);
        CreatedDate = new(review.CreatedDate.ToString("yyyy-MM-dd"));
    }
}