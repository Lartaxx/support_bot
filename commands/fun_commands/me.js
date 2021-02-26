const { Command } = require('discord.js-commando');
const mysql = require('mysql');
const pool  = mysql.createPool({
    host            : '127.0.0.1',
    user            : 'root',
    password        : '',
    port            : 3308,
    database        : 'support_bot'
});

module.exports = class MeInfosCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'me',
			aliases: ['me'],
			group: 'fun_commands',
			memberName: 'me',
			description: 'Voir les informations de soi-même'
		});
    }
    
    run(message) {
        pool.query(`SELECT * FROM warns WHERE guild_id = ${message.guild.id} AND user_id = ${message.author.id}`, function(error, results) {
            if (error) throw error;
            message.channel.send({embed: {
                color: "#2F3136",
                title: `__**Informations de ${message.author.username}**__`,
                thumbnail: {
                    url: message.author.avatarURL({dynamic: true}),
                },
                description: `Pseudo : ${message.author.username} \n Tag : ${message.author.tag} \n ID : ${message.author.id} \n Nombre d'avertissements :  ${results[0] ? results[0].nbr_warn : 0}`,
                timestamp: new Date()
            }})
        })
        
    }}