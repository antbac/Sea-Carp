namespace SeaCarp.CrossCutting.Extensions;

public static class BoolExtensions
{
    /// <summary>
    /// Converts false to 0 and true to 1.
    /// </summary>
    /// <param name="value">The boolean value to translate.</param>
    /// <returns>The integer representation of the boolean value.</returns>
    public static int ToInt(this bool value) => value ? 1 : 0;
}