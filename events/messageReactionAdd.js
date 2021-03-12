const mysql = require('mysql');
const {MessageEmbed} = require('discord.js');
const pool  = mysql.createPool({
    host            : '51.254.109.35',
    user            : 'u1101_UIzjT4Q0Pm',
    password        : 'klY3w@N5@P3QPRtXSEWwF7Fr',
    port            : 3306,
    database        : 's1101_lartaxx'
});
const config = require('../config.json');
const {format} = require('util');
module.exports = {
    event: "messageReactionAdd",
    once: false,
    run(reaction, user) {
        if (user.bot) return;
            pool.query(`SELECT * FROM guilds WHERE guild_id = ${reaction.message.guild.id}`, function(error, results) {
            if ( error ) throw error;
            if ( reaction.message.channel.id === results[0].id_channel_ticket.toString() ) {
                let cat = reaction.message.guild.channels.cache.find(cat => cat.name.startsWith("Tickets - Support'Bot"));
                let category_channels = Array.from(cat.children.values());
                for ( let i = 0; i <= category_channels.length-1; i++) {
                   if ( category_channels[i].name === format(config.language[results[0] ? results[0].language : "en"].tickets.name, user.username.toLowerCase())) { user.send(format(config.language[results[0] ? results[0].language : "en"].errors.have_ticket, reaction.message.guild.channels.cache.find(chan => chan.name === format(config.language[results[0] ? results[0].language : "en"].tickets.name, user.username.toLowerCase()))));
                   return reaction.users.remove(user.id); }
                }
                if ( reaction ) {
                switch ( reaction.emoji.name ) {
                    case "✅": {
                       reaction.message.guild.channels.create(format(config.language[results[0] ? results[0].language : "en"].tickets.name, user.username.toLowerCase()), {
                            type: "text",
                            parent: cat.id
                        }).then(chan => {
                            chan.setTopic(user.id);
                            chan.send({embed: {
                                color: "#2F3136",
                                title: config.language[results[0] ? results[0].language : "en"].warn.success_embed_title,
                                description: format(config.language[results[0] ? results[0].language : "en"].tickets.embed_description, reaction.message.guild.name),
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
                pool.query(`SELECT language FROM guilds WHERE guild_id = ${reaction.message.guild.id}`, function(err, results) {
                    if (err) throw err;
                    let user_find = reaction.message.guild.members.cache.get(reaction.message.channel.topic);
                    let _ticket_name = reaction.message.guild.channels.cache.find(chan => chan.name === format(config.language[results[0] ? results[0].language : "en"].tickets.ticket_name, user_find.user.username.toLowerCase()));
                    if ( reaction.message.channel.topic === user.id ) {
                        user_ticket = config.language[results[0] ? results[0].language : "en"].tickets.user;
                    }
                    else {
                        user_ticket = user;
                    }
                    let success_embed = new MessageEmbed()
                        .setColor(config.colors.success)
                        .setTitle(config.language[results[0] ? results[0].language : "en"].warn.success_embed_title)
                        .setDescription(format(config.language[results[0] ? results[0].language : "en"].tickets.embed_description, _ticket_name.name))
                        .setTimestamp();
                        reaction.message.guild.members.cache.get(reaction.message.channel.topic).send(success_embed);
                        reaction.message.channel.delete({timeout: 2000});
                        reaction.message.guild.members.cache.get(reaction.message.channel.topic).send({embed: {
                            color: config.colors.success,
                            title: config.language[results[0] ? results[0].language : "en"].warn.success_embed_title,
                            description: format(config.language[results[0] ? results[0].language : "en"].tickets.user_ticket, _ticket_name.name, user_ticket),
                            timestamp: new Date()
                        }})
                })
            }
            else {
                reaction.users.remove(user.id);
                return;
            }
           
        }
    }
};