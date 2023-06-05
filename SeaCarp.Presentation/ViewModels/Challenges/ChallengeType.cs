using System.ComponentModel;

namespace SeaCarp.Presentation.ViewModels.Challenges;

public enum ChallengeType
{
    [Description("Unknown")]
    Unknown = 0,

    [Description("Web Exploitation")]
    WebExploitation = 1,

    [Description("Cryptography")]
    Cryptography = 2,

    [Description("Reverse Engineering")]
    ReverseEngineering = 3,

    [Description("Forensics")]
    Forensics = 4,

    [Description("General Skills")]
    GeneralSkills = 5,

    [Description("Binary Exploitation")]
    BinaryExploitation = 6,

    [Description("Uncategorized")]
    Uncategorized = 7,
}