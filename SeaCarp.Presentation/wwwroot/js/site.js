// ------------------------------------------------------
// Bash-like terminal (Admin/Terminal)
// ------------------------------------------------------
// All commands are executed server-side via `/api/v1/admin/runterminalcommand`.

(function () {
    function escapeHtml(str) {
        return (str ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function nowIso() {
        try {
            return new Date().toISOString();
        } catch {
            return '';
        }
    }

    function tokenize(input) {
        const tokens = [];
        let current = '';
        let quote = null;

        for (let i = 0; i < input.length; i++) {
            const ch = input[i];

            if (quote) {
                if (ch === quote) {
                    quote = null;
                } else if (ch === '\\' && quote === '"' && i + 1 < input.length) {
                    current += input[i + 1];
                    i++;
                } else {
                    current += ch;
                }
                continue;
            }

            if (ch === '"' || ch === "'") {
                quote = ch;
                continue;
            }

            if (ch === ' ') {
                if (current.length) {
                    tokens.push(current);
                    current = '';
                }
                continue;
            }

            current += ch;
        }

        if (current.length) tokens.push(current);
        return tokens;
    }

    function createTerminal(root) {
        const screen = root.querySelector('[data-terminal-screen]');
        const output = root.querySelector('[data-terminal-output]');
        const inputSpan = root.querySelector('[data-terminal-input]');
        const hiddenInput = root.querySelector('[data-terminal-hidden-input]');
        const ps1 = root.querySelector('[data-terminal-ps1]');

        if (!screen || !output || !inputSpan || !hiddenInput || !ps1) {
            return null;
        }

        const state = {
            history: [],
            historyIndex: -1,
            cwd: '~',
            username: 'seacarp',
            host: 'localhost',
            isBusy: false
        };

        function updatePs1() {
            ps1.textContent = `${state.username}@${state.host}:${state.cwd}$`;
        }

        function scrollToBottom() {
            // Ensure we keep scrolling within the terminal viewport.
            screen.scrollTop = screen.scrollHeight;
        }

        function enforceOutputLimit() {
            // Prevent unbounded DOM growth, which can also contribute to layout issues in some browsers.
            const maxLines = 2000;
            while (output.childElementCount > maxLines) {
                output.removeChild(output.firstElementChild);
            }
        }

        function printLine(text, kind) {
            const div = document.createElement('div');
            div.className = 'bash-terminal__line' + (kind ? ` bash-terminal__line--${kind}` : '');
            div.innerHTML = escapeHtml(text);
            output.appendChild(div);
            enforceOutputLimit();
            scrollToBottom();
        }

        function printHtmlLine(html, kind) {
            const div = document.createElement('div');
            div.className = 'bash-terminal__line' + (kind ? ` bash-terminal__line--${kind}` : '');
            div.innerHTML = html;
            output.appendChild(div);
            enforceOutputLimit();
            scrollToBottom();
        }

        function printPromptEcho(cmd) {
            const prefix = escapeHtml(ps1.textContent);
            const command = escapeHtml(cmd);
            printHtmlLine(`<span style="color: var(--term-accent)">${prefix}</span> ${command}`);
        }

        function focusInput() {
            hiddenInput.focus({ preventScroll: true });
            scrollToBottom();
        }

        function setInputValue(value) {
            hiddenInput.value = value;
            inputSpan.textContent = value;
            scrollToBottom();
        }

        function renderServerOutput(outputText) {
            if (outputText === null || outputText === undefined) return;
            const normalized = String(outputText).replaceAll('\r\n', '\n');
            normalized.split('\n').forEach(l => printLine(l));
        }

        async function parseResponseBody(response) {
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return await response.json();
            }
            const text = await response.text();
            return { cwd: '', output: text };
        }

        async function runServerCommand(command) {
            await makeAuthorizedRequest(
                '/api/v1/admin/runterminalcommand',
                'POST',
                { command },
                {},
                response => {
                    if (response.success) {
                        renderServerOutput(response.output);
                        console.log("Success");
                        console.log(response);
                    }
                    else {
                        console.log("Error");
                        console.log(response);
                        handleException(response);
                    }
                });
        }

        async function execute(raw) {
            const input = (raw ?? '').trim();
            if (!input) return;
            if (state.isBusy) return;

            state.history.push(input);
            state.historyIndex = state.history.length;

            printPromptEcho(input);

            try {
                state.isBusy = true;
                await runServerCommand(input);
            } catch (e) {
                printLine(`Error: ${e?.message ?? e}`, 'error');
            } finally {
                state.isBusy = false;
            }
        }

        // Make the whole terminal clickable/focusable.
        root.addEventListener('mousedown', function (e) {
            // avoid stealing focus from selecting text in output
            if (e.button !== 0) return;
            focusInput();
        });

        root.addEventListener('keydown', function () {
            // If user tabs into the screen/root, move focus to the input.
            focusInput();
        });

        hiddenInput.addEventListener('input', function () {
            inputSpan.textContent = hiddenInput.value;
            scrollToBottom();
        });

        hiddenInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = hiddenInput.value;
                setInputValue('');
                void execute(value);
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!state.history.length) return;
                state.historyIndex = Math.max(0, state.historyIndex - 1);
                setInputValue(state.history[state.historyIndex] ?? '');
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!state.history.length) return;
                state.historyIndex = Math.min(state.history.length, state.historyIndex + 1);
                setInputValue(state.history[state.historyIndex] ?? '');
                return;
            }

            // Tab completion is intentionally removed (server-side shell should handle it).
            if (e.key === 'Tab') {
                e.preventDefault();
                return;
            }

            // Ctrl+L is intentionally left as a UI clear (no fake command output).
            if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
                e.preventDefault();
                output.innerHTML = '';
                return;
            }
        });

        updatePs1();
        printLine(`SeaCarp Terminal - ${nowIso()}`, 'muted');
        printLine('All commands are executed on the server.', 'muted');

        // Ensure it is focusable even if the user clicks quickly after navigation.
        setTimeout(focusInput, 0);

        return {
            focus: focusInput,
            write: printLine,
            exec: execute
        };
    }

    window.SeaCarpTerminal = {
        init: function (root) {
            if (!root) return null;
            return createTerminal(root);
        }
    };
})();