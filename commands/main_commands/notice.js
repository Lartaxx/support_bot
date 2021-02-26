const { Command } = require('discord.js-commando');
const config = require('../../config.json');
const {format} = require('util');
const mysql = require('mysql');
const { MessageEmbed } = require('discord.js');
const pool  = mysql.createPool({
    host            : '127.0.0.1',
    user            : 'root',
    password        : '',
    port            : 3308,
    database        : 'support_bot'
});
module.exports = class NoticeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'notice',
			aliases: ['n'],
			group: 'main_commands',
			memberName: 'notice',
			description: 'Mettre un avis du bot',
			ownerOnly: true,
			args: [
				{
					key: "notice", 
					type: "string",
					prompt: "",
				},
                {
					key: "stars", 
					type: "integer",
					prompt: "",
                    validate: key => key >= 1 && key <= 5
				}
			]
		});
    }
    
    run(message, {notice, stars}) {
        let owner_bot = this.client.guilds.cache.get("789808009613672448");
        let name_bot = this.client.user.username;
        pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, results) {
            if (err) throw err;
            if(!results[0] || results[0].feedback !== "1") return message.author.send(format(config.language[results[0] ? results[0].language : "en"].phrases.errors.feedback_error, name_bot));
            let emojis = "";
            for ( let i = 0; i < stars; i++ ) {
                emojis += "⭐"; 
            }
            let embed_notice = new MessageEmbed()
                .setColor(config.colors.info)
                .setTitle("Un nouvel avis est arrivé !")
                .addFields(
                    {name: "Serveur :", value: message.guild.name, inline: true},
                    {name: "Avis : ", value: notice, inline: true},
                    {name: "Note :", value: emojis, inline: true}
                )
                .setTimestamp();
                owner_bot.channels.cache.get("814631871736184853").send(embed_notice);
                message.author.send(config.language[results[0] ? results[0].language : "en"].phrases.notice.thank_you_for_feedback);
                pool.query(`UPDATE guilds SET feedback = 1 WHERE guild_id = ${message.guild.id}`, function(err) {if(err) throw err;});
        })
       
    }}