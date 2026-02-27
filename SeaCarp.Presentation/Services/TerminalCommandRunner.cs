using System.Diagnostics;

namespace SeaCarp.Presentation.Services;

internal static class TerminalCommandRunner
{
    public sealed record Result(int ExitCode, string StdOut, string StdErr, bool TimedOut);

    public static async Task<Result> RunBashAsync(
        string command,
        TimeSpan timeout,
        CancellationToken cancellationToken = default)
    {
        var psi = new ProcessStartInfo
        {
            FileName = "/bin/bash",
            Arguments = $"-lc \"{EscapeForBash(command)}\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using var process = new Process { StartInfo = psi };
        process.Start();

        var stdOutTask = process.StandardOutput.ReadToEndAsync(cancellationToken);
        var stdErrTask = process.StandardError.ReadToEndAsync(cancellationToken);

        var timedOut = false;
        using (var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken))
        {
            timeoutCts.CancelAfter(timeout);
            try
            {
                await process.WaitForExitAsync(timeoutCts.Token);
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                timedOut = true;
                try
                {
                    if (!process.HasExited)
                    {
                        process.Kill(entireProcessTree: true);
                    }
                }
                catch
                {
                    // best effort
                }
            }
        }

        var stdOut = await stdOutTask;
        var stdErr = await stdErrTask;

        var exitCode = timedOut || !process.HasExited ? -1 : process.ExitCode;

        return new Result(exitCode, stdOut, stdErr, timedOut);
    }

    private static string EscapeForBash(string command)
    {
        // We wrap in "..." for -lc "<cmd>". Escape backslashes and quotes.
        // Note: this is not a security boundary; authentication/authorization must protect this endpoint.
        return (command ?? string.Empty)
            .Replace("\\", "\\\\")
            .Replace("\"", "\\\"")
            .Replace("\r", string.Empty)
            .Replace("\n", "; ");
    }
}