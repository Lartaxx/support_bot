const { Command } = require('discord.js-commando');
const mysql = require('mysql');
const pool  = mysql.createPool({
    host            : 'host',
    user            : 'user',
    password        : 'password',
    port            : port,
    database        : 'database'
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
                }
            ]
		});
    }
    
    run(message, {channel_ticket}) {
        let categories_guild = message.guild.channels.cache.find(channel => channel.name === "Tickets - Support'Bot" && channel.type === "category");
        if (!categories_guild) {
            message.guild.channels.create("Tickets - Support'Bot", {
                type: "category"
            })
            pool.query(`INSERT INTO guilds(guild_id, guild_name, id_channel_ticket, total_warns, setup) VALUES('${message.guild.id}', '${message.guild.name}', '${channel_ticket.id}', 0, 1)`, function(error) {if(error) throw error;});
            message.guild.owner.send("Vous pouvez désormais configurer les permissions de la catégorie !");
                message.guild.owner.send({embed: {
                    color: "#2F3136",
                    title: "✅ | Succès !",
                    description: `Le channel ${channel_ticket} a bien été enregistré !`,
                    timestamp: new Date()
                }})
                pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(error, results) {
                    if (error) throw error;
                    if (!results[0]) return message.channel.send("Erreur");
                    message.guild.channels.cache.get(`${results[0].id_channel_ticket}`).send({embed: {
                        color: "#2F3136",
                        title: `${message.guild.name} - Ticket ||(Powered by Support'Bot)||`,
                        description: `Pour créer un ticket, veuillez réagir avec l'émoji ci-dessous.`,
                        timestamp: new Date()
                    }}).then(react => react.react("✅"));
                })
           
        }
        else {
            return message.channel.send("La catégorie est déjà crée !");
        }
    
    }}