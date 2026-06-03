import * as vscode from 'vscode';

// Define the snippet type
interface Snippet {
	name: string;
	body: string;
}

class SnippetsTreeDataProvider implements vscode.TreeDataProvider<SnippetTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<SnippetTreeItem | undefined | null | void> = new vscode.EventEmitter<SnippetTreeItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<SnippetTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

	private snippets: Snippet[] = [];
	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.loadSnippets();
	}

	private loadSnippets() {
		this.snippets = this.context.globalState.get<Snippet[]>('mySnippets') || [];
	}

	private async saveSnippets() {
		await this.context.globalState.update('mySnippets', this.snippets);
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: SnippetTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: SnippetTreeItem): Thenable<SnippetTreeItem[]> {
		if (element) {
			return Promise.resolve([]);
		}

		if (this.snippets.length === 0) {
			const emptyItem = new SnippetTreeItem(
				"No snippets yet. Select code and click 'Save Snippet'",
				vscode.TreeItemCollapsibleState.None
			);
			emptyItem.contextValue = 'empty';
			return Promise.resolve([emptyItem]);
		}

		const items = this.snippets.map((snippet, index) => {
			const item = new SnippetTreeItem(
				snippet.name,
				vscode.TreeItemCollapsibleState.None
			);
			item.description = snippet.body.substring(0, 50) + (snippet.body.length > 50 ? '...' : '');
			item.tooltip = snippet.body;
			item.contextValue = 'snippet';
			item.command = {
				command: 'my-snippet-manager.insertSnippet',
				title: 'Insert Snippet',
				arguments: [snippet.body]
			};
			item.id = `snippet-${index}`;

			// Store the snippet body for deletion
			item.snippetBody = snippet.body;
			item.snippetName = snippet.name;

			return item;
		});

		return Promise.resolve(items);
	}

	async addSnippet(name: string, body: string) {
		this.snippets.push({ name, body });
		await this.saveSnippets();
		vscode.window.showInformationMessage(`✅ Snippet "${name}" saved!`);
	}

	async deleteSnippet(name: string, body: string) {
		const index = this.snippets.findIndex(s => s.name === name && s.body === body);
		if (index !== -1) {
			this.snippets.splice(index, 1);
			await this.saveSnippets();
			vscode.window.showInformationMessage(`🗑️ Deleted snippet "${name}"`);
		}
	}

	refresh() {
		this._onDidChangeTreeData.fire();
	}
}

class SnippetTreeItem extends vscode.TreeItem {
	public snippetBody?: string;
	public snippetName?: string;

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);
	}
}

export function activate(context: vscode.ExtensionContext) {

	// Create the tree data provider
	const treeDataProvider = new SnippetsTreeDataProvider(context);

	// Register the tree view
	const treeView = vscode.window.createTreeView('snippetsTreeView', {
		treeDataProvider: treeDataProvider,
		showCollapseAll: true
	});
	context.subscriptions.push(treeView);

	// Register save command
	const saveCommand = vscode.commands.registerCommand('my-snippet-manager.saveSnippet', async () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const selection = editor.selection;
			const text = editor.document.getText(selection);

			if (!text) {
				vscode.window.showWarningMessage('No text selected!');
				return;
			}

			const name = await vscode.window.showInputBox({
				prompt: "Give this snippet a name",
				placeHolder: "e.g., console.log snippet"
			});

			if (name) {
				await treeDataProvider.addSnippet(name, text);
				treeDataProvider.refresh();
			}
		} else {
			vscode.window.showWarningMessage('No active editor found');
		}
	});
	context.subscriptions.push(saveCommand);

	// Register insert command
	const insertCommand = vscode.commands.registerCommand('my-snippet-manager.insertSnippet', async (snippetBody: string) => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			editor.edit(editBuilder => {
				editBuilder.insert(editor.selection.active, snippetBody);
			});
			vscode.window.showInformationMessage('✅ Snippet inserted!');
		}
	});
	context.subscriptions.push(insertCommand);

	// Register delete command
	const deleteCommand = vscode.commands.registerCommand('my-snippet-manager.deleteSnippet', async (item: SnippetTreeItem) => {
		if (item.snippetName && item.snippetBody) {
			const confirm = await vscode.window.showWarningMessage(
				`Delete snippet "${item.snippetName}"?`,
				'Yes', 'No'
			);
			if (confirm === 'Yes') {
				await treeDataProvider.deleteSnippet(item.snippetName, item.snippetBody);
				treeDataProvider.refresh();
			}
		}
	});
	context.subscriptions.push(deleteCommand);

	// Add status bar item
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = "$(code) Save Snippet";
	statusBarItem.tooltip = "Save selected code as snippet";
	statusBarItem.command = "my-snippet-manager.saveSnippet";
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

}

export function deactivate() { }