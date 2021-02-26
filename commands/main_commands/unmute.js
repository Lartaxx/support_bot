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
module.exports = class UnmuteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unmute',
			aliases: ['um'],
			group: 'main_commands',
			memberName: 'unmute',
			description: 'Démuer une personne',
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
        pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, results) {
            if (err) throw err;
            if (!results[0]) return message.channel.send(format(config.language[results[0] ? results[0].language : "en"].phrases.errors.no_entries_in_database, message.guild.owner));
            let mute_role = message.guild.roles.cache.find(role => role.name === "Muet | Mute");
            if ( !user._roles.some( role => role.includes(mute_role.id) ) ) {
                let error_embed = new MessageEmbed()
                    .setColor(config.colors.errors)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.mute.user_hasnt_mute_role, user.user.tag, mute_role.name));
                    message.channel.send(error_embed);
            }
            else {
                let succes_embed = new MessageEmbed()
                    .setColor(config.colors.success)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].phrases.unmute.embed_title, user.user.tag))
                    .setDescription(format(config.language[results[0] ? results[0].language : "en"].phrases.unmute.embed_description, message.author, user))
                    .addFields(
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.unmute.fields.title, value: format(config.language[results[0] ? results[0].language : "en"].phrases.unmute.fields.value, message.author)},
                        {name: config.language[results[0] ? results[0].language : "en"].phrases.unmute.fields.title_two, value: format(config.language[results[0] ? results[0].language : "en"].phrases.unmute.fields.value_two, reason)}
                    );
                    message.channel.send(succes_embed);
                message.guild.members.cache.get(user.id).roles.remove(mute_role.id);
            }
        })
       
    }}