using SeaCarp.CrossCutting.Services.Abstractions;
using System.Runtime.InteropServices;

namespace SeaCarp.CrossCutting.Services;

public class EnvironmentInformationService : IEnvironmentInformationService
{
    public (OSPlatform OperatingSystem, Architecture Architecture) GetCurrentEnvironmentInformation() => true switch
    {
        true when RuntimeInformation.IsOSPlatform(OSPlatform.Windows) => (OSPlatform.Windows, RuntimeInformation.ProcessArchitecture),
        true when RuntimeInformation.IsOSPlatform(OSPlatform.OSX) => (OSPlatform.Windows, RuntimeInformation.ProcessArchitecture),
        true when RuntimeInformation.IsOSPlatform(OSPlatform.Linux) => (OSPlatform.Windows, RuntimeInformation.ProcessArchitecture),
        _ => throw new PlatformNotSupportedException("Current OS is not supported in the current version of SeaCarp")
    };
}