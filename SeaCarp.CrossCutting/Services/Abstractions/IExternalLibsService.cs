namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface IExternalLibsService
{
    string GetExternalLibsFileEndings();

    string GetExternalLibsFilepath();
}