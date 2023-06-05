using System.ComponentModel;

namespace SeaCarp.CrossCutting.Extensions;

public static class EnumExtensions
{
    public static string GetDescription(this Enum value)
    {
        var fieldInfo = value.GetType().GetField(value.ToString());

        return fieldInfo?.GetCustomAttributes(typeof(DescriptionAttribute), false) is DescriptionAttribute[] attributes && attributes.Any()
            ? attributes.First().Description
            : value.ToString();
    }
}