const { Command } = require('discord.js-commando');
const {format} = require('util');
const config = require('../../config.json');
module.exports = class ModifyLanguageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'modify_language',
			aliases: ['ml'],
			group: 'main_commands',
			memberName: 'modify_language',
			description: 'Modifier le langage des phrases du bot',
			userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					key: "language", 
					type: "string",
					prompt: "",
				}
		]
	});
	this.pool = client.options.pool;
}
    
    run(message, {language}) {
		let pool = this.pool;
        if(!config.language_predefined.some(lang => language.includes(lang))) return message.channel.send("Bad language !");
       this.pool.query(`SELECT language FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, lang) {
            if(err) throw err;
            pool.query(`UPDATE guilds SET language = "${language}" WHERE guild_id = ${message.guild.id}`, function(err) {if(err) throw err;});
            message.channel.send(format(config.language[lang[0].language ? lang[0].language : "en"].success.modify_language_sucess, `${language.substr(0,2)}`, `${message.guild.name}`));
       })
    }
}