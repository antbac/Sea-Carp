using System.Text.RegularExpressions;

namespace SeaCarp.CrossCutting.Extensions;

public static class StringExtensions
{
    private static readonly Dictionary<string, string> _irregularNouns = new(StringComparer.OrdinalIgnoreCase)
    {
        { "child", "children" },
        { "foot", "feet" },
        { "goose", "geese" },
        { "man", "men" },
        { "woman", "women" },
        { "tooth", "teeth" },
        { "mouse", "mice" },
        { "person", "people" },
        { "cactus", "cacti" },
        { "focus", "foci" },
        { "fungus", "fungi" },
        { "nucleus", "nuclei" },
        { "syllabus", "syllabi" },
        { "analysis", "analyses" },
        { "diagnosis", "diagnoses" },
        { "oasis", "oases" },
        { "thesis", "theses" },
        { "crisis", "crises" },
        { "phenomenon", "phenomena" },
        { "criterion", "criteria" },
        { "datum", "data" },
    };

    /// <summary>
    /// Attempts to convert a singular English noun to its plural form.
    /// </summary>
    /// <param name="singular">The singular noun.</param>
    /// <returns>The plural form of the noun, if known or deducible.</returns>
    public static string ToPlural(this string singular)
    {
        if (string.IsNullOrWhiteSpace(singular))
        {
            return singular;
        }

        if (_irregularNouns.TryGetValue(singular.ToLower(), out var irregularPlural))
        {
            return MatchCapitalization(singular, irregularPlural);
        }

        if (Regex.IsMatch(singular, "(s|x|z|ch|sh)$", RegexOptions.IgnoreCase))
        {
            return singular + "es";
        }

        if (Regex.IsMatch(singular, "[^aeiou]y$", RegexOptions.IgnoreCase))
        {
            return Regex.Replace(singular, "y$", "ies", RegexOptions.IgnoreCase);
        }

        if (Regex.IsMatch(singular, "fe?$", RegexOptions.IgnoreCase))
        {
            string lowerSingular = singular.ToLower();
            if (lowerSingular.EndsWith("f") || lowerSingular.EndsWith("fe"))
            {
                var knownFtoVWords = new HashSet<string> { "knife", "leaf", "life", "loaf", "wife", "wolf", "shelf", "calf", "elf", "thief" };
                string root = lowerSingular.EndsWith("fe")
                    ? lowerSingular.Substring(0, lowerSingular.Length - 2)
                    : lowerSingular.Substring(0, lowerSingular.Length - 1);

                if (knownFtoVWords.Contains(lowerSingular) || knownFtoVWords.Contains(root + "f") || knownFtoVWords.Contains(root + "fe"))
                {
                    return Regex.Replace(singular, "fe?$", "ves", RegexOptions.IgnoreCase);
                }
            }
        }

        if (Regex.IsMatch(singular, "^(potato|tomato)$", RegexOptions.IgnoreCase))
        {
            return singular + "es";
        }

        return singular + "s";
    }

    /// <summary>
    /// Helper method to preserve the capitalization style of the original noun (simple approach).
    /// </summary>
    private static string MatchCapitalization(string original, string pluralForm)
    {
        if (original.ToUpper() == original)
        {
            return pluralForm.ToUpper();
        }

        if (char.IsUpper(original[0]) && original.Substring(1).ToLower() == original.Substring(1))
        {
            return char.ToUpper(pluralForm[0]) + pluralForm.Substring(1).ToLower();
        }

        return pluralForm;
    }
}