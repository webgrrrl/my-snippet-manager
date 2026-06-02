import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('snippet.save', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            
            // Prompt for a name/language
            const name = await vscode.window.showInputBox({ prompt: "Snippet Name" });
            
            // Save to context.globalState or a JSON file
            const snippets = context.globalState.get('mySnippets', []);
            snippets.push({ name, body: text });
            await context.globalState.update('mySnippets', snippets);
            
            vscode.window.showInformationMessage('Snippet saved!');
        }
    });

    context.subscriptions.push(disposable);
}