export interface ExtensionCommand {
    name: string;
    command: () => null | ExtensionCommand[];
}

export const top_commands : ExtensionCommand[] = [
    {
        name: "New Node",
        command: newNode
    }
];

function newNode() {
    console.log("New Node command called");
    return null;
}