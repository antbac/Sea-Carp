using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Globalization;

namespace SeaCarp.Infrastructure.Repositories;

public class SupportCaseRepository(
    ICryptographyService cryptographyService,
    IOrderRepository orderRepository,
    ITimeService timeService)
    : BaseRepository, ISupportCaseRepository
{
    private readonly ICryptographyService _cryptographyService = cryptographyService;
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly ITimeService _timeService = timeService;

    public void AddNote(int supportCaseId, int officerUserId, string note)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(@$"
                INSERT INTO {nameof(SupportCaseNote).ToPlural()}
                (
                    {nameof(SupportCaseNote.SupportCase)}Id,
                    {nameof(SupportCaseNote.CaseOfficer)}Id,
                    {nameof(SupportCaseNote.Note)},
                    {nameof(SupportCaseNote.CreatedDate)}
                ) VALUES (@1, @2, @3, @4);
            ",
                supportCaseId,
                officerUserId,
                note,
                _timeService.Now);

            cmd.ExecuteNonQuery();
        }
    }

    public SupportCase CreateSupportCase(int orderId, string description, string image)
    {
        lock (Database.RequestLock())
        {
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    INSERT INTO {nameof(SupportCase).ToPlural()}
                    (
                        {nameof(SupportCase.Order)}{nameof(SupportCase.Order.Id)},
                        {nameof(SupportCase.Description)},
                        {nameof(SupportCase.Image)},
                        {nameof(SupportCase.CreatedDate)},
                        {nameof(SupportCase.Status)}
                    ) VALUES (@1, @2, @3, @4, @5);
                ",
                    orderId,
                    description,
                    string.IsNullOrWhiteSpace(image) ? null : image,
                    _timeService.Now,
                    SupportCaseStatus.Open);

                cmd.ExecuteNonQuery();
            }

            var supportCase = GetNewestSupportCase();
            supportCase.Order = _orderRepository.GetOrderBySupportCaseId(supportCase.Id);

            return supportCase;
        }
    }

    public SupportCase GetCaseByCaseNumber(string identifier)
    {
        lock (Database.RequestLock())
        {
            var supportCase = GetCaseById(int.Parse(identifier.Replace("SC", string.Empty)));
            supportCase.Order = _orderRepository.GetOrderBySupportCaseId(supportCase.Id);

            return supportCase;
        }
    }

    public SupportCase GetCaseById(int id)
    {
        lock (Database.RequestLock())
        {
            SupportCase supportCase = null;
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    SELECT
                        {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)},
                        {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Description)},
                        {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Image)},
                        {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.CreatedDate)},
                        {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Status)},
                        {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.CaseOfficer)}Id,
                        {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.Id)},
                        {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.Note)},
                        {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.CreatedDate)},
                        {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.CaseOfficer)}Id
                    FROM {nameof(SupportCase).ToPlural()}
                    LEFT JOIN {nameof(SupportCaseNote).ToPlural()}
                        ON {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)} = {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.SupportCase)}Id
                    WHERE {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)} = @1;
                ",
                    id);

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    if (supportCase is null)
                    {
                        supportCase = new SupportCase
                        {
                            Id = reader.GetInt32(0),
                            Description = reader.GetString(1),
                            Image = reader.IsDBNull(2) ? null : reader.GetString(2),
                            CreatedDate = DateTime.ParseExact(reader.GetString(3), "yyyy-MM-dd HH:mm:ss:fff", CultureInfo.InvariantCulture),
                            Status = Enum.Parse<SupportCaseStatus>(reader.GetString(4))
                        };

                        if (!reader.IsDBNull(5))
                        {
                            var userId = reader.GetInt32(5);
                            supportCase.CaseOfficer = new UserRepository(_cryptographyService).GetUser(userId, true);
                        }
                    }

                    if (!reader.IsDBNull(6))
                    {
                        var note = new SupportCaseNote
                        {
                            Id = reader.GetInt32(6),
                            Note = reader.GetString(7),
                            CreatedDate = DateTime.ParseExact(reader.GetString(8), "yyyy-MM-dd HH:mm:ss:fff", CultureInfo.InvariantCulture),
                            CaseOfficer = new UserRepository(_cryptographyService).GetUser(reader.GetInt32(9), true),
                            SupportCase = supportCase
                        };

                        supportCase.Notes.Add(note);
                    }
                }
            }

            supportCase.Order = _orderRepository.GetOrderBySupportCaseId(id);

            return supportCase;
        }
    }

    public List<SupportCase> GetSupportCasesByOrderId(int orderId)
    {
        lock (Database.RequestLock())
        {
            var result = new List<SupportCase>();

            var supportCaseIds = new List<int>();
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    SELECT
                        {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)}
                    FROM {nameof(SupportCase).ToPlural()}
                    WHERE {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Order)}{nameof(SupportCase.Order.Id)} = @1;
                ",
                    orderId);

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    supportCaseIds.Add(reader.GetInt32(0));
                }
            }

            foreach (var supportCaseId in supportCaseIds)
            {
                result.Add(GetCaseById(supportCaseId));
            }

            return result;
        }
    }

    public List<SupportCase> GetUnhandledSupportCases()
    {
        lock (Database.RequestLock())
        {
            var result = new List<SupportCase>();

            var recentSupportCaseIds = new List<int>();
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    SELECT
                        {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)}
                    FROM {nameof(SupportCase).ToPlural()}
                    WHERE {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Status)} = @1;
                ",
                    SupportCaseStatus.Open);

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    recentSupportCaseIds.Add(reader.GetInt32(0));
                }
            }

            foreach (var supportCaseId in recentSupportCaseIds)
            {
                result.Add(GetCaseById(supportCaseId));
            }

            return result;
        }
    }

    public void UpdateCase(SupportCase supportCase)
    {
        lock (Database.RequestLock())
        {
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    UPDATE {nameof(SupportCase).ToPlural()}
                    SET
                        {nameof(SupportCase.Status)} = @1,
                        {nameof(SupportCase.CaseOfficer)}Id = @2
                    WHERE {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)} = @3;
                ",
                    supportCase.Status,
                    supportCase.CaseOfficer?.Id,
                    supportCase.Id);

                cmd.ExecuteNonQuery();
            }

            foreach (var note in supportCase.Notes)
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                        INSERT INTO {nameof(SupportCaseNote).ToPlural()}
                        (
                            {nameof(SupportCaseNote.SupportCase)}Id,
                            {nameof(SupportCaseNote.CaseOfficer)}Id,
                            {nameof(SupportCaseNote.Note)},
                            {nameof(SupportCaseNote.CreatedDate)}
                        )
                        SELECT @1, @2, @3, @4
                        WHERE NOT EXISTS (
                            SELECT 1 FROM {nameof(SupportCaseNote).ToPlural()}
                            WHERE
                                    {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.SupportCase)}Id = @5
                                AND {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.CaseOfficer)}Id = @6
                                AND {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.Note)} = @7
                                AND {nameof(SupportCaseNote).ToPlural()}.{nameof(SupportCaseNote.CreatedDate)} = @8
                        );
                    ",
                        supportCase.Id,
                        note.CaseOfficer?.Id,
                        note.Note,
                        note.CreatedDate,
                        supportCase.Id,
                        note.CaseOfficer?.Id,
                        note.Note,
                        note.CreatedDate);

                cmd.ExecuteNonQuery();
            }
        }
    }

    #region Private helper methods

    private SupportCase GetNewestSupportCase()
    {
        var supportCaseId = -1;
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = $"SELECT MAX({nameof(SupportCase.Id)}) FROM {nameof(SupportCase).ToPlural()};";
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                supportCaseId = reader.GetInt32(0);
            }
        }

        return GetCaseById(supportCaseId);
    }

    #endregion Private helper methods
}