const { Command } = require('discord.js-commando');
const mysql = require('mysql');
const pool  = mysql.createPool({
    host            : '51.254.109.35',
    user            : 'u1176_X2YBekD8Sb',
    password        : 'YNNR@rK==h1RY2O.3RrTPUqC=T.0PdtXp',
    port            : 3306,
    database        : 's1176_support_bot'
});

module.exports = class UserSearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user',
			aliases: ['user'],
			group: 'fun_commands',
			memberName: 'user',
            description: 'Chercher un utilisateur',
            args: [
                {
                    key: "searchuser",
                    type: "user",
                    prompt: "",
                    validate: user => String(user) && !Number(user)

                }
            ]
		});
    }
    
    run(message, {searchuser}) {
        if (!searchuser) return message.channel.send('Veuillez mentionner un membre valide');
        pool.query(`SELECT * FROM warns WHERE guild_id = ${message.guild.id} AND user_id = ${searchuser.id}`, function(error, results) {
            if (error) throw error;
            message.channel.send({embed: {
                color: "#2F3136",
                title: `Profil de : ${searchuser.username}`,
                description: `Pseudo : ${searchuser.username} \n ID : ${searchuser.id} \n Nombre d'avertissement(s) : ${results[0] ? results[0].nbr_warn : 0}`,
                thumbnail: {
                    url: searchuser.avatarURL({dynamic: true}),
                },
                timestamp: new Date()
            }}) 
        })
    }
}