export const divide = (text: string): any => {
    let sp = text.split(" ");

    if (sp.length > 1) {
        let querys = sp[1].split("_");
        let commands = {};

        querys.forEach(element => {
            let item = element.split("-");
            commands[item[0]] = item[1];
        });
        return commands;
    }

    return {};
}
