namespace SeaCarp.CrossCutting;

internal static class Log
{
    internal const int MAXIMUM_LOG_ENTRIES_PER_PAGE = 1000;
    internal const int MAXIMUM_NUMBER_OF_PAGES = 5;

    private static readonly Lock _lock = new();
    private static readonly LinkedList<string> _log = [];

    internal static string[] GetLogs(int page = 1)
    {
        if (page is <=1 or >MAXIMUM_NUMBER_OF_PAGES)
        {
            page = 1;
        }

        lock (_lock)
        {
            return [.. _log.Skip(MAXIMUM_LOG_ENTRIES_PER_PAGE * (page - 1)).Take(MAXIMUM_LOG_ENTRIES_PER_PAGE)];
        }
    }

    internal static void AppendLines(params string[] lines)
    {
        lock (_lock)
        {
            foreach (var line in lines.Reverse())
            {
                _log.AddFirst(line);
            }

            while (_log.Count > MAXIMUM_LOG_ENTRIES_PER_PAGE * MAXIMUM_NUMBER_OF_PAGES)
            {
                _log.RemoveLast();
            }
        }
    }
}