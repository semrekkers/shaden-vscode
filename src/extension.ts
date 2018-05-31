'use strict';

import * as vscode from 'vscode';
import * as http from 'http';

let outputChannel = vscode.window.createOutputChannel('Shaden');

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('shaden.patch', () => {
        const port = vscode.workspace.getConfiguration('shaden')['port'];

        const editor = vscode.window.activeTextEditor;
        if (editor == null) {
            return;
        }
        const selection = editor.document.getText(editor.selection);

        let options: http.RequestOptions = {
            host: 'localhost',
            port: port,
            path: '/eval',
            method: 'POST'
        };

        http.request(options, (res: http.IncomingMessage) => {
            var data: string = '';

            res.on('data', (chunk: string) => {
                data += chunk;
            });
            res.on('end', () => {
                if (data != 'OK') {
                    vscode.window.showErrorMessage('Shaden: Error while evaluating script');
                    outputChannel.appendLine('Error: ' + data);
                } else {
                    outputChannel.appendLine('Info:  Successfully evaluated script')
                }
            });
        })
        .on('error', (err) => {
            vscode.window.showErrorMessage("Shaden: Couldn't process request");
            outputChannel.appendLine(err + ', is Shaden running?');
        })
        .end(selection);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
