const { Command } = require('discord.js-commando');
const { format } = require('util');
const config = require('../../config.json');
module.exports = class ServerInfosCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server',
			aliases: ['server'],
			group: 'fun_commands',
			memberName: 'server',
			description: 'Voir les informations du serveur'
		});
        this.pool = client.options.pool;
    }
    
    run(message) {
        const pool = this.pool;
        this.pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(error, results) {
            if (error) throw error;
            pool.query(`SELECT language FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, lang) {
                if (err) throw err;
            message.channel.send({embed: {
                color: config.colors.info,
                title: format(config.language[lang[0] ? lang[0].language : "en"].server.title, message.guild.name),
                author: {
                    name: format(config.language[lang[0] ? lang[0].language : "en"].server.author, message.author.tag),
                    icon_url: `${message.author.avatarURL({dynamic: true})}`
                },
                thumbnail: {
                    url: message.guild.iconURL({dynamic: true}),
                },
                description: format(config.language[lang[0] ? lang[0].language : "en"].server.desc, message.guild.owner, message.guild.ownerID, message.guild.id, message.guild.memberCount, results[0] ? results[0].total_warns : 0),
                timestamp: new Date()
                }})
            })
        })
        
    }}