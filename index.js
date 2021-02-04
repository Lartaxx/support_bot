const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');
const fs = require('fs');
const client = new CommandoClient({
	commandPrefix: 'g!',
    owner: '332514331516207105',
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["main_commands", "Commandes principales du bot"],
        ["setup_command", "Permet de setup diverses commandes, pour l'arrivée des membres etc."],
        ["fun_commands", "Commandes fun"]
    ])
    .registerDefaultGroups()
	.registerDefaultCommands({
        help: false,
        prefix: false,
        eval: false,
        ping: false,
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));
    
    fs.readdir('./events/', (err, files) => { 
        if (err) return console.error(err); 
        console.log(`${files.length} évènement(s) chargé(s)`)
;        files.forEach(file => {
            const eventFunction = require(`./events/${file}`); 
            if (eventFunction.disabled) return; 
    
            const event = eventFunction.event || file.split('.')[0]; 
            const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
            const once = eventFunction.once;
    
            try {
                emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args));
            } catch (error) {
                console.error(error.stack);
            }
        });
    });

client.once('ready', () => {
    console.log(`Connecté avec ${client.user.tag}! (${client.user.id}) dans ${client.guilds.cache.size} serveur(s)`);
    setInterval(() => {
        client.user.setActivity(`Travaille dans ${client.guilds.cache.size} serveurs`, {type: "WATCHING"});
    }, 5000);
    });
    
client.on('error', console.error);


client.login(config.token)