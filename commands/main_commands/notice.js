const { Command } = require('discord.js-commando');
const config = require('../../config.json');
const {format} = require('util');
const { MessageEmbed } = require('discord.js');
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
					prompt: "Notice !",
				},
                {
					key: "stars", 
					type: "integer",
					prompt: "Your advise !",
                    validate: key => key >= 1 && key <= 5
				}
			]
		});
        this.pool = client.options.pool;
    }
    
    run(message, {notice, stars}) {
        let pool = this.pool;
        let owner_bot = this.client.guilds.cache.get("789808009613672448");
        let name_bot = this.client.user.username;
        this.pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, results) {
            if (err) throw err;
            if(!results[0] || results[0].feedback === 1) return message.author.send(format(config.language[results[0] ? results[0].language : "en"].errors.feedback_error, name_bot));
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
                owner_bot.channels.cache.get("818932323952099399").send(embed_notice);
                message.author.send(config.language[results[0] ? results[0].language : "en"].notice.thank_you_for_feedback);
                pool.query(`UPDATE guilds SET feedback = 1 WHERE guild_id = ${message.guild.id}`, function(err) {if(err) throw err;});
        })
       
    }}