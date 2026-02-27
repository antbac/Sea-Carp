using SeaCarp.Domain.Abstractions;
using System.Text;

namespace SeaCarp.Infrastructure.Repositories;

public class DebugRepository() : IDebugRepository
{
    public string QueryDatabase(string query)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = query;
            using var reader = cmd.ExecuteReader();

            var output = new StringBuilder();
            while (reader.Read())
            {
                var row = new List<string>();
                for (var i = 0; i < reader.FieldCount; i++)
                {
                    row.Add(reader.GetValue(i).ToString());
                }

                output.AppendLine(string.Join(" | ", row));
            }

            return output.ToString();
        }
    }

    public void UpdateDatabase(string command)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = command;
            cmd.ExecuteNonQuery();
        }
    }
}