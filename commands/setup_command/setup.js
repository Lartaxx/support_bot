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
module.exports = class SetupTicketCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setup',
			aliases: ['setup'],
			group: 'main_commands',
			memberName: 'setup',
			description: 'Setup la commande ticket',
            ownerOnly: true,
            args: [
				{
					key: "channel_ticket",
					type: "channel",
					prompt: ""
                },
                {
                    key: "language_choice",
                    type: "string",
                    prompt: ""
                }
            ]
		});
    }
    
    run(message, {channel_ticket, language_choice}) {
        if (!config.language_predefined.some(lang => language_choice.includes(lang))) return message.channel.send(config.language['en'].phrases.errors.bad_language);
        let categories_guild = message.guild.channels.cache.find(channel => channel.name === "Tickets - Support'Bot" && channel.type === "category");
        if (!categories_guild) {
            message.guild.channels.create("Tickets - Support'Bot", {
                type: "category"
            })
            try {
            pool.query(`INSERT INTO guilds(guild_id, guild_name, id_channel_ticket, total_warns, language, setup) VALUES('${message.guild.id}', '${message.guild.name}', '${channel_ticket.id}', 0, '${language_choice}', 1)`, function(error) {if(error) throw error;});
            message.guild.owner.send("Vous pouvez désormais configurer les permissions de la catégorie !");
                message.guild.owner.send({embed: {
                    color: "#2F3136",
                    title: "✅ | Succès !",
                    description: `Le channel ${channel_ticket} a bien été enregistré !`,
                    timestamp: new Date()
                }})
                pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(error, results) {
                    if (error) throw error;
                    message.guild.channels.cache.get(`${results[0].id_channel_ticket}`).send({embed: {
                        color: "#2F3136",
                        title: `${message.guild.name} - Ticket ||(Powered by Support'Bot)||`,
                        description: `Pour créer un ticket, veuillez réagir avec l'émoji ci-dessous.`,
                        timestamp: new Date()
                    }}).then(react => react.react("✅"));
                })
            }
            catch(err) {
                let error_embed = new MessageEmbed()
                    .setColor(config.colors.errors)
                    .setTitle("Error !")
                    .setDescription(`An error has occured, \n Error : ${error_embed}`);
                    message.channel.send(error_embed);
            }
           
        }
        else {
            return message.channel.send("La catégorie est déjà crée !");
        }
    
    }}