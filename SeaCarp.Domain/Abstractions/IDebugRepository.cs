namespace SeaCarp.Domain.Abstractions;

public interface IDebugRepository
{
    string QueryDatabase(string query);

    void UpdateDatabase(string command);
}