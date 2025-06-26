namespace SeaCarp.Presentation.Models.Api.v1;

public class ProductReview
{
    public string User { get; private set; }
    public int Rating { get; private set; }
    public string Comment { get; private set; }
    public DateTime CreatedDate { get; private set; }

    public ProductReview(Domain.Models.Review review = null)
    {
        if (review is null)
        {
            User = string.Empty;
            Comment = string.Empty;
            CreatedDate = default;
            return;
        }

        User = string.IsNullOrWhiteSpace(review.User) ? string.Empty : review.User;
        Rating = review.Rating;
        Comment = string.IsNullOrWhiteSpace(review.Comment) ? string.Empty : review.Comment;
        CreatedDate = review.CreatedDate;
    }
}