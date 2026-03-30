using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.Contracts;

public class ProductReviewDto(Review review)
{
    public string User { get; init; } = string.IsNullOrWhiteSpace(review?.User) ? string.Empty : review.User;
    public int Rating { get; init; } = review?.Rating ?? default;
    public string Comment { get; init; } = string.IsNullOrWhiteSpace(review?.Comment) ? string.Empty : review.Comment;
    public DateTime CreatedDate { get; init; } = review?.CreatedDate ?? default;
}