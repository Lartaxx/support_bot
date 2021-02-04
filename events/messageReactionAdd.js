const mysql = require('mysql');
const pool  = mysql.createPool({
    host            : 'host',
    user            : 'user',
    password        : 'password',
    port            : port,
    database        : 'database'
});
module.exports = {
    event: "messageReactionAdd",
    once: false,
    run(reaction, user) {
        if (user.bot) return;
        pool.query(`SELECT id_channel_ticket FROM guilds WHERE guild_id = ${reaction.message.guild.id}`, function(error, results) {
            if ( error ) throw error;
            if ( reaction.message.channel.id === results[0].id_channel_ticket.toString() ) {
                let cat = reaction.message.guild.channels.cache.find(cat => cat.name.startsWith("Tickets - Support'Bot"));
                let category_channels = Array.from(cat.children.values());
                for ( let i = 0; i <= category_channels.length-1; i++) {
                   if ( category_channels[i].name === `ticket-de-${user.username.toLowerCase()}`) { user.send(`Vous avez déjà un ticket actif : ${reaction.message.guild.channels.cache.find(chan => chan.name === `ticket-de-${user.username.toLowerCase()}`)}, veuillez demander la suppression de celui-ci pour en créer une autre !`); return reaction.users.remove(user.id); }
                }
                if ( reaction ) {
                switch ( reaction.emoji.name ) {
                    case "✅": {
                       reaction.message.guild.channels.create(`ticket-de-${user.username.toLowerCase()}`, {
                            type: "text",
                            parent: cat.id
                        }).then(chan => {
                            chan.setTopic(user.id);
                            chan.send({embed: {
                                color: "#2F3136",
                                title: "✅ | Succès !",
                                description: `Votre ticket a été créer avec succès ! Vous pouvez désormais discuter avec l'équipe du server *${reaction.message.guild.name}* \n\n Pour fermer votre ticket, vous pouvez réagir avec l'émoji ci-dessous.`,
                                timestamp: new Date()
                            }}).then( async chan => await chan.react("❌") )
                            
                        })

                        }
                    }
                }
            }
        })
        if ( reaction.emoji.name === "❌" )  {
            if (reaction.message.channel.topic === user.id || reaction.message.guild.members.cache.get(user.id).hasPermission("MANAGE_CHANNELS")) {
                let user_find = reaction.message.guild.members.cache.get(reaction.message.channel.topic);
                let _ticket_name = reaction.message.guild.channels.cache.find(chan => chan.name === `ticket-de-${user_find.user.username.toLowerCase()}`);
                let user_ticket;
                if ( reaction.message.channel.topic === user.id ) {
                    user_ticket = "vous-même";
                }
                else {
                    user_ticket = user;
                }
                reaction.message.guild.members.cache.get(reaction.message.channel.topic).send({embed: {
                    color: "#2F3136",
                    title: "✅ | Succès !",
                    description: `Votre ticket **${_ticket_name.name || "Erreur"}** a été fermé par ${user_ticket || "erreur"}.`,
                    timestamp: new Date()
                }})
                reaction.message.channel.delete({timeout: 2000});
            }
            else {
                reaction.users.remove(user.id);
                return;
            }
           
        }
        else {
            reaction.users.remove(user.id)
        }   
    }
};