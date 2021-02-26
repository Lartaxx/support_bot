const { Command } = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const config = require('../../config.json');
const mysql = require('mysql');
const pool  = mysql.createPool({
    host            : '127.0.0.1',
    user            : 'root',
    password        : '',
    port            : 3308,
    database        : 'support_bot'
});
const {format} = require('util');
module.exports = class UnbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unban',
			aliases: ['ub'],
			group: 'main_commands',
			memberName: 'uban',
			description: 'Débannir une personne',
			userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					key: "user", 
					type: "string",
					prompt: "",
				}
			]
		});
    }
    
    run(message, {user}) {
        pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, async function(err, results) {
            if (err) throw err;
            if ( user === message.author.id || user === message.guild.ownerID ) {
                let error_embed = new MessageEmbed()
                    .setColor(config.colors.errors)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.errors.unban_me_or_owner, message.guild.name));
                    message.channel.send(error_embed);
            }
            else {
                message.guild.fetchBans()
                .then(banned => {
                    if ( !banned.size ) {
                        let error_embed = new MessageEmbed()
                            .setColor(config.colors.errors)
                            .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.errors.no_banned_users, message.guild.name))
                        message.channel.send(error_embed);
                    }
                    banned.forEach(async users => {
                        if ( users.user.id === user ) {
                            message.guild.members.unban(user);
                            let succes_embed = new MessageEmbed()
                            .setColor(config.colors.success)
                            .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.unban.first_title, message.author.tag))
                            await message.channel.send(succes_embed);
                        }

                        else {
                            return message.channel.send(config.language[results[0] ? results[0].language : "en"].phrases.errors.user_not_found);
                        }
                    })
                })
                
            }
        })
       
    }}