import * as vscode from 'vscode';
import { SnippetSidebarProvider } from './SnippetSidebarProvider';

export function activate(context: vscode.ExtensionContext) {

	// 1. Register the Sidebar Webview Provider
	const provider = new SnippetSidebarProvider(context.extensionUri, context);
	console.log("Registering snippet-view...");
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('snippet-view', provider)
	);

	// Force the view to appear
    setTimeout(() => {
        vscode.commands.executeCommand('snippet-view.focus');
    }, 1000);

	// 2. Register the 'Save Snippet' Command
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
				const snippets = context.globalState.get<{ name: string, body: string }[]>('mySnippets') || [];

				// Add new snippet
				snippets.push({ name, body: text });

				// Save back to globalState
				await context.globalState.update('mySnippets', snippets);

				vscode.window.showInformationMessage(`Snippet "${name}" saved successfully!`);

				// Note: To make the UI update automatically, you would trigger a 
				// refresh method on your provider here!
			}
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }