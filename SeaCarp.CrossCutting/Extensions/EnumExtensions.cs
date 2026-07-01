using System.ComponentModel;

namespace SeaCarp.CrossCutting.Extensions;

public static class EnumExtensions
{
    public static string GetDescription(this Enum value)
    {
        var fieldInfo = value.GetType().GetField(value.ToString());

        return fieldInfo?.GetCustomAttributes(typeof(DescriptionAttribute), false) is DescriptionAttribute[] attributes && attributes.Length != 0
            ? attributes[0].Description
            : value.ToString();
    }
}