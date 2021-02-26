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
module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			aliases: ['b'],
			group: 'main_commands',
			memberName: 'ban',
			description: 'Bannir une personne',
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
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.errors.ban_me_or_owner, message.guild.name));
                    message.channel.send(error_embed);
            }
            else {
                let succes_embed = new MessageEmbed()
                    .setColor(config.colors.success)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.ban.embed_title, message.author.tag, user.user.tag, message.guild.name))
                    .setDescription(format(config.language[results[0] ? results[0].language : "en"].phrases.ban.embed_description, user))
                    .addFields(
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.ban.fields.title, value: format(config.language[results[0] ? results[0].language : "en"].phrases.unmute.fields.value, message.author)},
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.ban.fields.title_two, value: format(config.language[results[0] ? results[0].language : "en"].phrases.ban.fields.value_two, reason)}
                    );
                    message.channel.send(succes_embed);

                    let ban_embed = new MessageEmbed()
                    .setColor(config.colors.info)
                    .setTitle(config.language[results[0] ? results[0].language : "en"].phrases.ban.user.embed_title)
                    .setDescription(format(config.language[results[0] ? results[0].language : "en"].phrases.ban.user.embed_description, `${message.author}`, `${message.guild.name}`))
                    .addFields(
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.ban.fields.title, value: format(config.language[results[0] ? results[0].language : "en"].phrases.unmute.fields.value, message.author)},
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.ban.fields.title_two, value: format(config.language[results[0] ? results[0].language : "en"].phrases.ban.fields.value_two, reason)}
                    );
                    await user.send(ban_embed);
                await message.guild.members.cache.get(user.id).ban({reason: reason});
            }
        })
       
    }}