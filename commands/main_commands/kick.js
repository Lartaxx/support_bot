const { Command } = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const config = require('../../config.json');
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
        this.pool = client.options.pool;
    }
    
    run(message, {user, reason}) {
        this.pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, async function(err, results) {
            if (err) throw err;
            if ( user.id === message.author.id || user.id === message.guild.ownerID ) {
                let error_embed = new MessageEmbed()
                    .setColor(config.colors.errors)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].errors.kick_me_or_owner, message.guild.name));
                    message.channel.send(error_embed);
            }
            else {
                let succes_embed = new MessageEmbed()
                    .setColor(config.colors.success)
                    .setTitle(format(config.language[results[0] ? results[0].language : "en"].kick.embed_title, message.author.tag, user.user.tag, message.guild.name))
                    .setDescription(format(config.language[results[0] ? results[0].language : "en"].kick.embed_description, user))
                    .addFields(
                        {name: config.language[results[0] ? results[0].language : "en"].kick.fields.title, value: format(config.language[results[0] ? results[0].language : "en"].unmute.fields.value, message.author)},
                        {name: config.language[results[0] ? results[0].language : "en"].kick.fields.title_two, value: format(config.language[results[0] ? results[0].language : "en"].kick.fields.value_two, reason)}
                    );
                    message.channel.send(succes_embed);

                    let kick_embed = new MessageEmbed()
                    .setColor(config.colors.info)
                    .setTitle(config.language[results[0] ? results[0].language : "en"].kick.user.embed_title)
                    .setDescription(format(config.language[results[0] ? results[0].language : "en"].kick.user.embed_description, `${message.author}`, `${message.guild.name}`))
                    .addFields(
                        {name: config.language[results[0] ? results[0].language : "en"].kick.fields.title, value: format(config.language[results[0] ? results[0].language : "en"].unmute.fields.value, message.author)},
                        {name: config.language[results[0] ? results[0].language : "en"].kick.fields.title_two, value: format(config.language[results[0] ? results[0].language : "en"].kick.fields.value_two, reason)}
                    );
                    await user.send(kick_embed);
                await message.guild.members.cache.get(user.id).kick({reason: reason});
            }
        })
       
    }}