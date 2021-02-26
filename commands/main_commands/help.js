const { Command } = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {format} = require('util');
const config = require('../../config.json');
const mysql = require('mysql');
const pool  = mysql.createPool({
    host            : '127.0.0.1',
    user            : 'root',
    password        : '',
    port            : 3308,
    database        : 'support_bot'
});

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['h'],
			group: 'main_commands',
			memberName: "help",
			description: 'Voir les commandes du bot',
	});
}
    
    run(message) {
       pool.query(`SELECT language FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, lang) {
           if (err) throw err;
           let help_embed = new MessageEmbed()
            .setColor(config.colors.info)
            .setTitle(format(config.language[lang[0].language ? lang[0].language : "en"].phrases.help.title_embed, message.author.tag))
            .setDescription(config.language[lang[0].language ? lang[0].language : "en"].phrases.help.description_embed)
            message.channel.send(help_embed);
       })
    }
}