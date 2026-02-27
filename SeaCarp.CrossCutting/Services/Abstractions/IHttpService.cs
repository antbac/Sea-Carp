namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface IHttpService
{
    Task<object> FetchContent(string url, OutputType outputType, AuthenticationLevel authenticationLevel);
}