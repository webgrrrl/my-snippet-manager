import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    
    // This registers your command
    let disposable = vscode.commands.registerCommand('my-snippet-manager.saveSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            
            if (!text) {
                vscode.window.showWarningMessage('No text selected!');
                return;
            }

            // Prompt for a name
            const name = await vscode.window.showInputBox({ prompt: "Give this snippet a name" });
            
            if (name) {
                // Get existing snippets or initialize an empty array
                const snippets = context.globalState.get<{name: string, body: string}[]>('mySnippets') || [];
                
                // Add new snippet
                snippets.push({ name, body: text });
                
                // Save back to globalState
                await context.globalState.update('mySnippets', snippets);
                
                vscode.window.showInformationMessage(`Snippet "${name}" saved successfully!`);
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}