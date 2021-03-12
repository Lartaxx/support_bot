const { Command } = require('discord.js-commando');
const { format } = require('util');
const config = require('../../config.json');
module.exports = class MeInfosCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'me',
			aliases: ['me'],
			group: 'fun_commands',
			memberName: 'me',
			description: 'Voir les informations de soi-même',
		});
        this.pool = client.options.pool;
    }
    
    run(message) {
            const pool = this.pool;
            this.pool.query(`SELECT * FROM warns WHERE guild_id = ${message.guild.id} AND user_id = ${message.author.id}`, function(error, results) {
            if (error) throw error;
                pool.query(`SELECT language FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, lang) {
                    if (err) throw err;
                    message.channel.send({embed: {
                        color: config.colors.info,
                        title: format(config.language[lang[0] ? lang[0].language : "en"].me.title, message.author.username),
                        thumbnail: {
                            url: message.author.avatarURL({dynamic: true}),
                        },
                        description: format(config.language[lang[0] ? lang[0].language : "en"].me.desc, message.author.username, message.author.tag, message.author.id, results[0] ? results[0].nbr_warn : 0),
                        timestamp: new Date()
                    }})
                })
        })
        
    }}