// ------------------------------------------------------
// Shopping cart (shared helper)
// ------------------------------------------------------
// The cart lives in the non-HttpOnly "cart" cookie (a CartToken) so the server
// can render the mini-cart badge on every page. JS owns reading/writing it.
const SeaCarpCart = (function () {
    const COOKIE = 'cart';

    function readToken() {
        const entry = document.cookie
            .split('; ')
            .find(c => c.startsWith(COOKIE + '='));

        if (!entry) {
            return null;
        }

        try {
            return JSON.parse(decodeURIComponent(entry.substring(COOKIE.length + 1)));
        } catch {
            return null;
        }
    }

    function get() {
        const token = readToken();
        return token && Array.isArray(token.items) ? token.items : [];
    }

    function save(items) {
        const token = {
            currency: 'USD',
            updatedUtc: new Date().toISOString(),
            items: items
        };

        document.cookie = COOKIE + '=' +
            encodeURIComponent(JSON.stringify(token)) +
            '; path=/; SameSite=Lax';
    }

    function clear() {
        document.cookie = COOKIE +
            '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }

    function count() {
        return get().length;
    }

    return { get, save, clear, count };
})();

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
                output.firstElementChild.remove();
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

    globalThis.SeaCarpTerminal = {
        init: function (root) {
            if (!root) return null;
            return createTerminal(root);
        }
    };
})();