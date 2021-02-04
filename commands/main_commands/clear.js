const { Command } = require('discord.js-commando');
module.exports = class ClearCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			aliases: ['clear', 'clear_nbr'],
			group: 'main_commands',
			memberName: 'clear',
			description: 'Clear un nombre n de message(s)',
			userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					key: "number_delete", 
					type: "integer",
					prompt: "",
					validate: number => {
						if ( Number(number) && number > 0 && number <= 100 ) return true;
						else return "Merci de renseigner un nombre";
					}
				}
			]
		});
    }
    
    run(message, {number_delete}) {
        message.channel.bulkDelete(parseInt((number_delete)))
        .then(messages => message.channel.send(`Nombre de messages supprimés : ${messages.size}`)).then(msg => msg.delete({timeout: 5000}))
        .catch(console.error);
    }}