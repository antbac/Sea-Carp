using SeaCarp.Presentation.Config;

namespace SeaCarp.Presentation.Extensions;

public static class StringExtensions
{
    public static string RemoveControllerSuffix(this string controllerName) =>
        controllerName.EndsWith(Constants.ControllerSuffix)
            ? controllerName[..^Constants.ControllerSuffix.Length]
            : controllerName;
}