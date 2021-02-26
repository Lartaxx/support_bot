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
module.exports = class KickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			aliases: ['k'],
			group: 'main_commands',
			memberName: 'kick',
			description: 'Expulser une personne',
			userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					key: "user", 
					type: "member",
					prompt: "",
				},
                {
                    key: "reason",
                    type: "string",
                    prompt: "",
                }
			]
		});
    }
    
    run(message, {user, reason}) {
        pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, async function(err, results) {
            if (err) throw err;
            if ( user.id === message.author.id || user.id === message.guild.ownerID ) {
                let error_embed = new MessageEmbed()
                    .setColor(config.colors.errors)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.errors.kick_me_or_owner, message.guild.name));
                    message.channel.send(error_embed);
            }
            else {
                let succes_embed = new MessageEmbed()
                    .setColor(config.colors.success)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.kick.embed_title, message.author.tag, user.user.tag, message.guild.name))
                    .setDescription(format(config.language[results[0] ? results[0].language : "en"].phrases.kick.embed_description, user))
                    .addFields(
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.kick.fields.title, value: format(config.language[results[0] ? results[0].language : "en"].phrases.unmute.fields.value, message.author)},
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.kick.fields.title_two, value: format(config.language[results[0] ? results[0].language : "en"].phrases.kick.fields.value_two, reason)}
                    );
                    message.channel.send(succes_embed);

                    let kick_embed = new MessageEmbed()
                    .setColor(config.colors.info)
                    .setTitle(config.language[results[0] ? results[0].language : "en"].phrases.kick.user.embed_title)
                    .setDescription(format(config.language[results[0] ? results[0].language : "en"].phrases.kick.user.embed_description, `${message.author}`, `${message.guild.name}`))
                    .addFields(
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.kick.fields.title, value: format(config.language[results[0] ? results[0].language : "en"].phrases.unmute.fields.value, message.author)},
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.kick.fields.title_two, value: format(config.language[results[0] ? results[0].language : "en"].phrases.kick.fields.value_two, reason)}
                    );
                    await user.send(kick_embed);
                await message.guild.members.cache.get(user.id).kick({reason: reason});
            }
        })
       
    }}