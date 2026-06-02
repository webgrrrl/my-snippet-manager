import * as vscode from 'vscode';

export class SnippetSidebarProvider implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionUri: vscode.Uri, private readonly _context: vscode.ExtensionContext) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = { enableScripts: true };

        // Send existing snippets to the webview when it loads
        const snippets = this._context.globalState.get('mySnippets') || [];
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, snippets);

        // Handle messages from the Webview (e.g., clicking a snippet to insert)
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'insertSnippet') {
                const editor = vscode.window.activeTextEditor;
                editor?.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, message.text);
                });
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview, snippets: any[]) {
        return `<!DOCTYPE html>
        <html>
            <body>
                <h2>My Snippets</h2>
                <input type="text" id="search" placeholder="Search..." onkeyup="filter()">
                <div id="list">
                    ${snippets.map(s => `<button onclick="insert('${s.body.replace(/'/g, "\\'")}')">${s.name}</button>`).join('<br>')}
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    function insert(text) { vscode.postMessage({ command: 'insertSnippet', text }); }
                    function filter() { /* Add simple search filter here */ }
                </script>
            </body>
        </html>`;
    }
}