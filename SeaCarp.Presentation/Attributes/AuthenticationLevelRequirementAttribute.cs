using SeaCarp.CrossCutting;

namespace SeaCarp.Presentation.Attributes;

[AttributeUsage(AttributeTargets.Method)]
internal class AuthenticationLevelRequirementAttribute : Attribute
{
    public AuthenticationLevel AuthenticationLevel { get; set; }

    public AuthenticationLevelRequirementAttribute(AuthenticationLevel authenticationLevel)
    {
        AuthenticationLevel = authenticationLevel;
    }
}