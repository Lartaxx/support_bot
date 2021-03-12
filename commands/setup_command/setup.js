const { Command } = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const config = require('../../config.json');
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
        this.pool = client.options.pool;
    }
    
    async run(message, {channel_ticket, language_choice}) {
        if (!config.language_predefined.some(lang => language_choice.includes(lang))) return message.channel.send(config.language['en'].errors.bad_language);
        let categories_guild = message.guild.channels.cache.find(channel => channel.name === "Tickets - Support'Bot" && channel.type === "category");
        if (!categories_guild) {
            message.guild.channels.create("Tickets - Support'Bot", {
                type: "category"
            })
            try {
                await this.pool.query(`INSERT INTO guilds(guild_id, guild_name, id_channel_ticket, total_warns, language, setup) VALUES('${message.guild.id}', '${message.guild.name}', '${channel_ticket.id}', 0, '${language_choice}', 1)`, function(error) {if(error) throw error;});
           await  message.guild.owner.send("You can now configure the category permissions!");
                message.guild.owner.send({embed: {
                    color: "#2F3136",
                    title: "✅ | Success",
                    description: `${channel_ticket} channel has been save!`,
                    timestamp: new Date()
                }})
               await this.pool.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, function(error, results) {
                    if (error) throw error;
                    message.guild.channels.cache.get(`${results[0].id_channel_ticket}`).send({embed: {
                        color: config.colors.success,
                        title: `${message.guild.name} - Ticket ||(Powered by Support'Bot)||`,
                        description: config.language[results[0] ? results[0].language : "en"].tickets.setup_ticket,
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
            return message.channel.send("The category is already created!");
        }
    
    }}