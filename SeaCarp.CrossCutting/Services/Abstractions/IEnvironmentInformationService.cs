using System.Runtime.InteropServices;

namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface IEnvironmentInformationService
{
    (OSPlatform OperatingSystem, Architecture Architecture) GetCurrentEnvironmentInformation();
}