using SeaCarp.CrossCutting.Services.Abstractions;
using System.Runtime.InteropServices;

namespace SeaCarp.CrossCutting.Services;

public class ExternalLibsService(IEnvironmentInformationService environmentInformationService) : IExternalLibsService
{
    public string GetExternalLibsFileEndings()
    {
        var (osPlatform, _) = environmentInformationService.GetCurrentEnvironmentInformation();

        return true switch
        {
            _ when osPlatform == OSPlatform.Windows => ".dll",
            _ when osPlatform == OSPlatform.OSX => ".dylib",
            _ when osPlatform == OSPlatform.Linux => ".so",
            _ => throw new PlatformNotSupportedException("Current OS is not supported in the current version of SeaCarp")
        };
    }

    public string GetExternalLibsFilepath()
    {
        var (osPlatform, architecture) = environmentInformationService.GetCurrentEnvironmentInformation();
        var externalLibsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ExternalLibs");

        return true switch
        {
            _ when osPlatform == OSPlatform.Windows && architecture == Architecture.X64 => Path.Combine(externalLibsPath, "win-x64"),
            _ when osPlatform == OSPlatform.Windows && architecture == Architecture.X86 => Path.Combine(externalLibsPath, "win-x86"),
            _ when osPlatform == OSPlatform.OSX && architecture == Architecture.Arm64 => Path.Combine(externalLibsPath, "macos-arm64"),
            _ when osPlatform == OSPlatform.OSX && architecture == Architecture.X86 => Path.Combine(externalLibsPath, "macos-x86"),
            _ when osPlatform == OSPlatform.Linux && architecture == Architecture.Arm64 => Path.Combine(externalLibsPath, "linux-arm64"),
            _ when osPlatform == OSPlatform.Linux && architecture == Architecture.X86 => Path.Combine(externalLibsPath, "linux-x86"),
            _ => throw new PlatformNotSupportedException("Current OS is not supported in the current version of SeaCarp")
        };
    }
}