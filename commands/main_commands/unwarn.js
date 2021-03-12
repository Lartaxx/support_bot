const {MessageEmbed} = require('discord.js');
const config = require('../../config.json');
const {format} = require('util');
const { Command } = require('discord.js-commando');

module.exports = class UnwarnCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unwarn',
			aliases: ['unwarn', 'uw'],
			group: 'main_commands',
			memberName: 'unwarn',
			description: 'Enlever un avertissement d\'un membre',
			userPermissions: ["MANAGE_MESSAGES", "MANAGE_ROLES"],
            args: [
				{
					key: "member_unwarn",
					type: "member",
					prompt: "",
                },
                {
                    key: "number_unwarn",
                    type: "integer",
                    prompt: "",
                    validate: key => key >= 1
                },
                {
                    key: "reason_unwarn",
                    type: "string",
                    prompt: ""
                }
               
            ]
		});
        this.pool = client.options.pool;
    }
    
    run(message, {member_unwarn, number_unwarn, reason_unwarn}) {
        let pool = this.pool;
        this.pool.query(`SELECT * FROM warns WHERE user_id = ${member_unwarn.id}`, function(err, results) {
            if (err) throw err;
            pool.query(`SELECT language FROM guilds WHERE guild_id = ${message.guild.id}`, function(error, lang) {
                if (error) throw error;
            if ( Math.sign(results[0].nbr_warn) === -1 ) {
                return message.delete();
            }
            
            else if ( Math.sign(results[0].nbr_warn - number_unwarn ) === -1 ) {
                let embed_errors_warn = new MessageEmbed()
                    .setColor(config.colors.errors)
                    .setTitle(config.language[lang[0].language ? lang[0].language : "en"].unwarn.errors_embed_title)
                    .setDescription(format(config.language[lang[0].language ? lang[0].language : "en"].unwarn.errors_embed_description, number_unwarn, member_unwarn, results[0].nbr_warn - number_unwarn));
                    return message.channel.send(embed_errors_warn);
            }

            else if ( results[0].nbr_warn === 0 ) {
                let embed_empty_warn = new MessageEmbed()
                .setColor(config.colors.errors)
                .setTitle(config.language[lang[0].language ? lang[0].language : "en"].unwarn.errors_embed_title)
                .setDescription(format(config.language[lang[0].language ? lang[0].language : "en"].unwarn.errors_embed_empty_description, member_unwarn))
                return message.channel.send(embed_empty_warn);
            }
            
            else {
                unwarn(member_unwarn, number_unwarn);
                let embed_success_warn = new MessageEmbed()
                    .setColor(config.colors.info)
                    .setTitle(config.language[lang[0].language ? lang[0].language : "en"].unwarn.success_embed_title)
                    .setDescription(format(config.language[lang[0].language ? lang[0].language : "en"].unwarn.success_embed_description, `${message.author}`, `${number_unwarn}`, `${member_unwarn}`))
                    .addField(config.language[lang[0].language ? lang[0].language : "en"].unwarn.success_embed_field_title, `${reason_unwarn}`, false)
                    .setFooter(format(config.language[lang[0].language ? lang[0].language : "en"].unwarn.success_embed_footer, `${results[0].nbr_warn - number_unwarn}`))
                    .setTimestamp();
                    message.channel.send(embed_success_warn);
                }
            })
        })

        function unwarn(member, number) {
                pool.query(`SELECT * FROM warns WHERE guild_id = ${member.guild.id}`, function(error, warns) {
                if(error) throw error;
               
                if(!warns[0]) {
                    return `${member} n'a pas de warn !`;
                }
                
                else {
                    pool.query(`UPDATE warns SET nbr_warn = nbr_warn - ${number} WHERE user_id = ${member.id} AND guild_id = ${member.guild.id}`, function(error) {if(error) throw error;});
                    pool.query(`UPDATE guilds SET total_warns = total_warns - ${number} WHERE guild_id = ${member.guild.id}`, function(error) {if(error) throw error;});
                }
            })
        }

        
}}
