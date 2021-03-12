const { Command } = require('discord.js-commando');
const config = require('../../config.json');
const {format} = require('util');

// Function for addwarn


module.exports = class WarnCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'warn',
			aliases: ['warn', 'avertissement'],
			group: 'main_commands',
			memberName: 'warn',
			description: 'Avertir un membre',
			userPermissions: ["MANAGE_MESSAGES", "MANAGE_ROLES"],
            args: [
                {
                    key: "member_warn",
                    type: "member",
                    prompt: ""
                },
                {
                    key: "reason_warn",
                    type: "string",
                    prompt: ""
                }
            ]
		});
        this.pool = client.options.pool;
    }
    
    run(message, {member_warn, reason_warn}) {
            let pool = this.pool;
            if(member_warn.bot) return;
            if(member_warn.id === message.guild.ownerID || member_warn.id === message.author.id) { return message.reply('Vous ne pouvez pas vous warn vous-même ! Ou warn le propriétaire !');}
            this.pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(error, results) {
            if (error) throw error;
            if (!results[0]) return message.channel.send(format(config.language[results[0] ? results[0].language : "en"].errors.not_config, message.guild.owner));                
                try {
                    addwarn(member_warn);
                    message.author.send({embed: {
                    color: config.colors.success,
                    title: config.language[results[0].language ? results[0].language : "en"].warn.success_embed_title,
                    description: format(config.language[results[0].language ? results[0].language : "en"].warn.success_embed_description, `${member_warn}`),
                    timestamp: new Date()
                    }})
                    member_warn.send({embed: {
                        color: config.colors.warning,
                        title: config.language[results[0].language ? results[0].language : "en"].warn.warn_embed_user_title,
                        description: format(config.language[results[0].language ? results[0].language : "en"].warn.warn_embed_user_description, `${message.author}`, `*${reason_warn}*`, `*${message.guild.name}*`),
                        timestamp: new Date()
                    }})
                }
                catch(error) {
                    message.channel.send({embed: {
                    color: config.colors.errors,
                    title:  config.language[results[0].language ? results[0].language : "en"].warn.errors_embed_title,
                    description: format(config.language[results[0].language ? results[0].language : "en"].warn.errors_embed_description, `${member_warn}`, `${error}`)
                }});
            }



            function addwarn(member) {
                pool.query(`SELECT * FROM warns WHERE guild_id = ${member.guild.id}`, function(error, warns) {
                    if(error) throw error;
                   
                    if(!warns[0]) {
                        pool.query(`INSERT INTO warns(user_id, user_tag, guild_name, guild_id, nbr_warn) VALUES('${member.id}', '${member.user.username + "#" + member.user.discriminator}', '${member.guild.name}', '${member.guild.id}', 1)`, function(error) {if(error) throw error;});
                        pool.query(`UPDATE guilds SET total_warns = total_warns + 1 WHERE guild_id = ${member.guild.id}`, function(error) {if(error) throw error;});
                    }
                    else {
                        pool.query(`UPDATE warns SET nbr_warn = nbr_warn + 1 WHERE user_id = ${member.id} AND guild_id = ${member.guild.id}`, function(error) {if(error) throw error;});
                        pool.query(`UPDATE guilds SET total_warns = total_warns + 1 WHERE guild_id = ${member.guild.id}`, function(error) {if(error) throw error;});
                    }
                })
            }
    })
   
        
}}

