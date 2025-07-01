using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Globalization;
using System.Text.RegularExpressions;

namespace SeaCarp.Infrastructure.Repositories;

public class SupportCaseRepository(IOrderRepository orderRepository) : ISupportCaseRepository
{
    private readonly IOrderRepository _orderRepository = orderRepository;

    public async Task<SupportCase> CreateSupportCase(int orderId, string description, string image)
    {
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
            INSERT INTO {nameof(SupportCase).ToPlural()}
            (
                {nameof(SupportCase.Order)}{nameof(SupportCase.Order.Id)},
                {nameof(SupportCase.Description)},
                {nameof(SupportCase.Image)},
                {nameof(SupportCase.CreatedDate)}
            ) VALUES (
                {orderId},
                '{description}',
                {(string.IsNullOrWhiteSpace(image) ? "NULL" : $"'{image}'")},
                '{DateTime.Now:yyyy-MM-dd HH:mm:ss:fff}'
            );
        ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }

        var supportCase = await GetNewestSupportCase();
        supportCase.Order = await _orderRepository.GetOrderBySupportCaseId(supportCase.Id);

        return supportCase;
    }

    public async Task<SupportCase> GetCaseByCaseNumber(string identifier)
    {
        var supportCase = await GetCaseById(int.Parse(identifier.Replace("SC", string.Empty)));
        supportCase.Order = await _orderRepository.GetOrderBySupportCaseId(supportCase.Id);

        return supportCase;
    }

    public async Task<SupportCase> GetCaseById(int id)
    {
        SupportCase supportCase = null;
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                SELECT
                    {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)},
                    {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Description)},
                    {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Image)},
                    {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.CreatedDate)}
                FROM {nameof(SupportCase).ToPlural()}
                WHERE {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)} = {id};
            ", @"\s+", " ");

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                supportCase = new SupportCase
                {
                    Id = reader.GetInt32(0),
                    Description = reader.GetString(1),
                    Image = reader.IsDBNull(2) ? null : reader.GetString(2),
                    CreatedDate = DateTime.ParseExact(reader.GetString(3), "yyyy-MM-dd HH:mm:ss:fff", CultureInfo.InvariantCulture),
                };
            }
        }

        supportCase.Order = await _orderRepository.GetOrderBySupportCaseId(id);

        return supportCase;
    }

    public async Task<List<SupportCase>> GetRecentSupportCases(DateTime openedAfter)
    {
        var result = new List<SupportCase>();

        var recentSupportCaseIds = new List<int>();
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                SELECT
                    {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)}
                FROM {nameof(SupportCase).ToPlural()}
                WHERE {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.CreatedDate)} >= '{openedAfter:yyyy-MM-dd HH:mm:ss:fff}';
            ", @"\s+", " ");

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                recentSupportCaseIds.Add(reader.GetInt32(0));
            }
        }

        foreach (var supportCaseId in recentSupportCaseIds)
        {
            result.Add(await GetCaseById(supportCaseId));
        }

        return result;
    }

    public async Task<List<SupportCase>> GetSupportCasesByOrderId(int orderId)
    {
        var result = new List<SupportCase>();

        var supportCaseIds = new List<int>();
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                SELECT
                    {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)}
                FROM {nameof(SupportCase).ToPlural()}
                WHERE {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Order)}{nameof(SupportCase.Order.Id)} = {orderId};
            ", @"\s+", " ");

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                supportCaseIds.Add(reader.GetInt32(0));
            }
        }

        foreach (var supportCaseId in supportCaseIds)
        {
            result.Add(await GetCaseById(supportCaseId));
        }

        return result;
    }

    private async Task<SupportCase> GetNewestSupportCase()
    {
        var supportCaseId = -1;
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = $"SELECT MAX({nameof(SupportCase.Id)}) FROM {nameof(SupportCase).ToPlural()};";
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                supportCaseId = reader.GetInt32(0);
            }
        }

        return await GetCaseById(supportCaseId);
    }
}