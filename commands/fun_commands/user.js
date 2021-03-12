const { Command } = require('discord.js-commando');
const {format} = require('util');
const config = require('../../config.json');
module.exports = class UserSearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user',
			aliases: ['user'],
			group: 'fun_commands',
			memberName: 'user',
            description: 'Chercher un utilisateur',
            args: [
                {
                    key: "searchuser",
                    type: "user",
                    prompt: "",
                    validate: user => String(user) && !Number(user)

                }
            ]
		});
        this.pool = client.options.pool;
    }
    
    run(message, {searchuser}) {
        const pool = this.pool;
        if (!searchuser) return message.channel.send('Veuillez mentionner un membre valide');
        this.pool.query(`SELECT * FROM warns WHERE guild_id = ${message.guild.id} AND user_id = ${searchuser.id}`, function(error, results) {
            let nbr_warn = results[0] ? results[0].nbr_warn : 0;
            if (error) throw error;
                pool.query(`SELECT language FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, lang) {
                    if (err) throw err;
                    message.channel.send({embed: {
                        color: config.colors.info,
                        title: format(config.language[lang[0] ? lang[0].language : "en"].user.profile, searchuser.username),
                        description: format(config.language[lang[0] ? lang[0].language : "en"].user.desc, searchuser.username, searchuser.id, nbr_warn),
                        thumbnail: {
                            url: searchuser.displayAvatarURL(),
                        },
                        timestamp: new Date()
                    }}) 
                })
        })
    }
}