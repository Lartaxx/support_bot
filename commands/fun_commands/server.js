const { Command } = require('discord.js-commando');
const mysql = require('mysql');
const pool  = mysql.createPool({
    host            : '51.254.109.35',
    user            : 'u1176_X2YBekD8Sb',
    password        : 'YNNR@rK==h1RY2O.3RrTPUqC=T.0PdtXp',
    port            : 3306,
    database        : 's1176_support_bot'
});

module.exports = class ServerInfosCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server',
			aliases: ['server'],
			group: 'fun_commands',
			memberName: 'server',
			description: 'Voir les informations du serveur'
		});
    }
    
    run(message) {
        pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(error, results) {
            if (error) throw error;
            message.channel.send({embed: {
                color: "#2F3136",
                title: `__**${message.guild.name}**__`,
                author: {
                    name: `Demandé par ${message.author.tag}`,
                    icon_url: `${message.author.avatarURL({dynamic: true})}`
                },
                thumbnail: {
                    url: message.guild.iconURL({dynamic: true}),
                },
                description: `__**Informations du discord**__ : \n\n Propriétaire : ${message.guild.owner}(${message.guild.ownerID}) \n ID du Discord : ${message.guild.id} \n Nombre de membres : ${message.guild.memberCount} \n Nombre de warns effectués : ${results[0] ? results[0].total_warns : 0}`,
                timestamp: new Date()
            }})
        })
        
    }}