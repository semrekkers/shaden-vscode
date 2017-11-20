'use strict';

import * as vscode from 'vscode';
import * as http from 'http';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('shaden.patch', () => {
        const port = vscode.workspace.getConfiguration('shaden')['port'];

        const editor = vscode.window.activeTextEditor;
        const selection = editor.document.getText(editor.selection);

        let options: http.RequestOptions = {
            host: 'localhost',
            port: port,
            path: '/eval',
            method: 'POST'
        };

        http.get(options, (res: http.IncomingMessage) => {
            var data: string = '';

            res.on('data', (chunk: string) => {
                data += chunk;
            });
            res.on('end', () => {
                if (data != 'OK') {
                    vscode.window.showErrorMessage(data);
                }
            });
        })
        .end(selection);

    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}