const { Command } = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const config = require('../../config.json');
const {format} = require('util');
module.exports = class MuteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mute',
			aliases: ['m'],
			group: 'main_commands',
			memberName: 'mute',
			description: 'Muer une personne',
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
        this.pool = client.options.pool;
    }
    
    run(message, {user, reason}) {
        this.pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(err, results) {
            if (err) throw err;
            if (!results[0]) return message.channel.send(format(config.language[results[0] ? results[0].language : "en"].errors.no_entries_in_database, message.guild.owner));
            let mute_role = message.guild.roles.cache.find(role => role.name === "Muet | Mute");
            if ( user._roles.some( role => role.includes(mute_role.id) ) ) {
                let error_embed = new MessageEmbed()
                    .setColor(config.colors.errors)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].mute.user_has_mute_role, user.user.tag, mute_role.name));
                    message.channel.send(error_embed);
            }
            else {
                let succes_embed = new MessageEmbed()
                    .setColor(config.colors.success)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].mute.embed_title, user.user.tag))
                    .setDescription(format(config.language[results[0] ? results[0].language : "en"].mute.embed_description, message.author, user))
                    .addFields(
                        {name: config.language[results[0] ? results[0].language : "en"].mute.fields.title, value: format(config.language[results[0] ? results[0].language : "en"].mute.fields.value, message.author)},
                        {name: config.language[results[0] ? results[0].language : "en"].mute.fields.title_two, value: format(config.language[results[0] ? results[0].language : "en"].mute.fields.value_two, reason)}
                    );
                    message.channel.send(succes_embed);
                message.guild.members.cache.get(user.id).roles.add(mute_role.id);
            }
        })
       
    }}