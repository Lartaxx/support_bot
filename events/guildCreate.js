const moment = require('moment');
moment.locale('fr');
module.exports = {
    event: "guildCreate",
    once: false,
    run(guild) {
    let date = moment(guild.joinedTimestamp).format('LT');
     guild.members.cache.get(guild.ownerID).send({embed: {
        color: "#2F3136",
        title: `Merci d'utiliser Support'Bot | Thanks to use Support'Bot !`,
        description: `Arrivée de Support'Bot : ${date} \n\nBonjour / Bonsoir, merci d'utiliser **Support'Bot** ! \n\n Ce message vous est adressé car vous êtes le propriétaire du serveur *${guild.name}* et vous expliquer la procédure à suivre pour configurer votre serveur ! \n\n Le préfixe du bot est actuellement *g!*, vous pourrez bientôt le changer dans une prochaine mise à jour. \n\n Dès l'arrivée du bot sur votre serveur, vous pouvez faire *g!setup* #ticket_channel pour configurer le channel où les utilisateurs pourront réagir pour créer un ticket. \n (**attention : c'est un système de réaction, les utilisateurs doivent donc avoir la permission de réagir au message du bot, crée automatiquement !**). \n **ATTENTION : Ne changez pas le nom de la catégorie, sous peine que le bot vous fasse une erreur !** \n\n__**Listes des commandes**__ : \n **g!me** : Permet de voir son profil sur le serveur où la commande est faite. \n **g!server** : Permet de voir les statistiques du serveur où la commande est faite. \n**g!user @user** : Permet de voir le profil de l'utilisateur mentioné dans le serveur où la commande est tapée. \n **g!clear nombre** : Permet de supprimer 100 messages maximum dans n'importe quel channel(s) où la commande est tapée. \n **g!setup (Vous seulement)** : Permet de configurer le système de ticket dans le serveur où la commande est tapée. \n **g!warn @user raison** : Permet d'avertir un utilisateur, le nombre d'avertissement(s) de tous les utilisateurs est visible dans le profil de la personne concernée dans le serveur où la commande est tapée.\n\n Cordialement,\nLartaxx\n Développeur - Support'Bot`
     }});
    }
};