using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Infrastructure.Repositories;

public class BugReportRepository : BaseRepository, IBugReportRepository
{
    public void CloseBugReport(int id)
    {
        lock (Database.RequestLock())
        {
            using var command = Database.GetConnection().CreateCommand();
            command.CommandText = GenerateSecureQuery(@$"
                    UPDATE {nameof(BugReport).ToPlural()}
                    SET Closed = 1
                    WHERE {nameof(BugReport.Id)} = @1;
                ",
                id);

            command.ExecuteNonQuery();
        }
    }

    public void CreateBugReport(BugReport bugReport)
    {
        lock (Database.RequestLock())
        {
            using var command = Database.GetConnection().CreateCommand();
            command.CommandText = GenerateSecureQuery(@$"
                    INSERT INTO {nameof(BugReport).ToPlural()}
                    (
                        {nameof(BugReport.Title)},
                        {nameof(BugReport.Description)},
                        {nameof(BugReport.FiledBy)},
                        Closed
                    )
                    VALUES (@1, @2, @3, 0);
                ",
                bugReport.Title,
                bugReport.Description,
                bugReport.FiledBy);

            command.ExecuteNonQuery();
        }
    }

    public List<BugReport> GetOpenBugReports()
    {
        lock (Database.RequestLock())
        {
            using var command = Database.GetConnection().CreateCommand();
            command.CommandText = @$"
                SELECT
                    {nameof(BugReport.Id)},
                    {nameof(BugReport.Title)},
                    {nameof(BugReport.Description)},
                    {nameof(BugReport.FiledBy)}
                FROM {nameof(BugReport).ToPlural()}
                WHERE Closed = 0;
            ";

            using var reader = command.ExecuteReader();
            var bugReports = new List<BugReport>();
            while (reader.Read())
            {
                var bugReport = new BugReport
                {
                    Id = reader.GetInt32(0),
                    Title = reader.GetString(1),
                    Description = reader.GetString(2),
                    FiledBy = reader.GetString(3),
                };
                bugReports.Add(bugReport);
            }

            return bugReports;
        }
    }
}