namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface IHttpService
{
    Task<object> FetchContentAsync(string url, OutputType outputType);
}