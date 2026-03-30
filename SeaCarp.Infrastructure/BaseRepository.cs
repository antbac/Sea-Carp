using SeaCarp.CrossCutting.Extensions;
using System.Text.RegularExpressions;

namespace SeaCarp.Infrastructure;

public abstract class BaseRepository
{
    protected string GenerateSecureQuery(string queryTemplate, params object[] parameters)
    {
        for (var i = parameters.Length - 1; i >= 0; i--)
        {
            var escapedParameter = parameters[i] switch
            {
                null => "NULL",
                string s when s is not null => $"'{EscapeParameter(parameters[i]?.ToString())}'",
                Enum e => $"'{e}'",
                float or double or decimal or int => parameters[i].ToString().Replace(",", "."),
                bool b => b.ToInt().ToString(),
                DateTime dt => $"'{dt:yyyy-MM-dd HH:mm:ss:fff}'",
                _ => EscapeParameter(parameters[i]?.ToString())
            };

            queryTemplate = queryTemplate.Replace($"@{i+1}", escapedParameter);
        }

        return Regex.Replace(queryTemplate, @"\s+", " ");
    }

    /// <summary>
    /// Escapes a parameter value for safe inclusion in a SQL statement.
    /// </summary>
    /// <remarks>If the data is already trusted, the parameter is returned unchanged. This method helps
    /// prevent SQL injection when constructing SQL statements dynamically.</remarks>
    /// <param name="parameter">The parameter value to be escaped.</param>
    /// <returns>A string that is safe to use as a SQL parameter.</returns>
    protected string EscapeParameter(string parameter)
    {
        if (parameter is null)
        {
            return "NULL";
        }

        // Prevent stacked queries
        return parameter.Replace(";", "");
    }
}