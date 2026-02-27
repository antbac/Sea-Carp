namespace SeaCarp.CrossCutting.Extensions;

public static class IEnumerableExtensions
{
    /// <summary>
    /// Picks one element from the enumerable uniformly at random.
    /// </summary>
    /// <param name="enumerable">The enumerable to pick from.</param>
    /// <returns>A random element from the enumerable.</returns>
    public static T PickOne<T>(this IEnumerable<T> enumerable) => enumerable
        .Select((value, index) => new { value, index })
        .Aggregate(enumerable.First(), (currentlySelectedElement, iterationElement) =>
            Random.Shared.Next(1, iterationElement.index + 2) == 1
                ? iterationElement.value
                : currentlySelectedElement);
}