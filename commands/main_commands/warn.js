const { Command } = require('discord.js-commando');
const mysql = require('mysql');
const pool  = mysql.createPool({
    host            : '51.254.109.35',
    user            : 'u1176_X2YBekD8Sb',
    password        : 'YNNR@rK==h1RY2O.3RrTPUqC=T.0PdtXp',
    port            : 3306,
    database        : 's1176_support_bot'
});

// Function for addwarn

function addwarn(member) {
    pool.query(`SELECT * FROM warns WHERE guild_id = ${member.guild.id}`, function(error, warns) {
        if(error) throw error;
       
        if(!warns[0]) {
            pool.query(`INSERT INTO warns(user_id, user_tag, guild_name, guild_id, nbr_warn) VALUES('${member.user.id}', '${member.user.tag}', '${member.guild.name}', '${member.guild.id}', 1)`, function(error) {if(error) throw error;});
            pool.query(`UPDATE guilds SET total_warns = total_warns + 1 WHERE guild_id = ${member.guild.id}`, function(error) {if(error) throw error;});
        }
        else {
            pool.query(`UPDATE warns SET nbr_warn = nbr_warn + 1 WHERE user_id = ${member.user.id} AND guild_id = ${member.guild.id}`, function(error) {if(error) throw error;});
            pool.query(`UPDATE guilds SET total_warns = total_warns + 1 WHERE guild_id = ${member.guild.id}`, function(error) {if(error) throw error;});
        }
    })
}

module.exports = class WarnCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'warn',
			aliases: ['warn', 'avertissement'],
			group: 'main_commands',
			memberName: 'warn',
			description: 'Avertir un membre',
			userPermissions: ["MANAGE_MESSAGES", "MANAGE_ROLES"]
		});
    }
    
    run(message) {
        let member_mention = message.mentions.members.first();
        if (!member_mention) return message.reply('vous devez mettre un utilisateur');
        if(member_mention.user.bot) return;
        if(member_mention.user.id === message.guild.ownerID || member_mention.user.id === message.author.id) { return message.reply('Vous ne pouvez pas vous warn vous-même ! Ou warn le propriétaire !');}
        let reason = message.content.split(" ").slice(2).join(" ");
        if(!reason) reason = "Aucune raison spécifiée";
       pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(error, results) {
        if (error) throw error;
        if (!results[0]) return message.channel.send(`${message.guild.owner} doit configurer le serveur avant que vous puissiez avertir un utilisateur !`);
        else {
            try {
                addwarn(member_mention, reason);
                message.author.send({embed: {
                 color: "#2F3136",
                 title: "✅ | Succès !",
                 description: `Avertissement du membre ${member_mention} a été effectué avec succès !`,
                 timestamp: new Date()
                 }})
                 member_mention.send({embed: {
                     color: "#2F3136",
                     title: "⚠️ | Vous avez été averti !",
                     description: `Vous avez été averti par ${message.author} pour la raison *${reason}* sur le serveur *${message.guild.name}*`,
                     timestamp: new Date()
                 }})
            }
            catch(error) {
                message.channel.send({embed: {
                 color: "#2F3136",
                 title: `❌ | Échec !`,
                 description: `L'avertissement du membre ${member} a subi un échec ! \n Raison : ${error}`
             }});
        }
      
    }
       
    })
}}