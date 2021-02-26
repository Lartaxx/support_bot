# Presentation

### Support'Bot is a support bot able to meet your expectations. Going from orders for tickets, to warnings for your members... 

# Bot commands

> Fun commands
### - **g!me**, with this command you can see your profile on the concerned server!
### - **g!server**, with this command you can get the statistics of the concerned server!
### - **g!user** [*@user*], with this command you can see the profile of the member mentioned in the concerned server!

> Main commands
### - **g!clear** [*number*] (<= 100), with this command you can delete x number of messages in a channel!
### - **g!warn** [*@user*] [*reason*], with this command you can warn a member with a reason or not!
### - **g!unwarn** [*@user*] [*number*] [*reason*], with this command you can remove a x number with reason!
### - **g!ban** [*@user*] [*reason*], with this command you can ban a member of your guild!
### - **g!unban** [*@userid*], with this command you can unban a member of your guild!
### - **g!mute** [*@user*] [*reason*], with this command you can mute a member of your guild!
### - **g!unmute** [*@user*] [*reason*], with this command you can unmute a member of your guild!
### - **g!kick** [*@user*] [*reason*], with this command you can kick a member of your guild!
### - **g!modify_language** [*language*], with this command you can change the main language of your guild!
### - **g!help**, with this command you show all the command's to use!

> Setup command
### - **g!setup** [*#ticket_channel*] [*language*], with this command you can configure the channel in which users will be able to react to create a ticket!

## Several updates will come with time, the prefix is not yet configurable, but it will happen soon...

>## Add a translation

You can add a language to send a mp in discord, **Lartaxx#8301**
I sent to you, the english translation !, you can use this template and modify to your language, and sent your new translation in discord dm.
```json
         "en": {
            "phrases": {

                "warn": {
                    "errror_owner_own": "You cannot warn yourself or the owner of the server!",
                    "success_embed_title": "✅ | Success!",
                    "errors_embed_title": "❌ | Failure!",
                    "success_embed_description": "Warn of %s has been successfully completed!",
                    "errors_embed_description": "The member warning %s has failed! \n Reason: %s",
                    "warn_embed_user_title": "⚠️ | You have been warned!",
                    "warn_embed_user_description": "You have been warned by %s for the reason %s on the server %s."
                },

                "unwarn": {
                    "errors_embed_empty_description": "%s has no warning!",
                    "success_embed_title": "✅ | Success!",
                    "errors_embed_title": "❌ | Failure!",
                    "success_embed_description": "%s removed %d warnings!",
                    "success_embed_field_title": "Reason :",
                    "success_embed_footer": "Remaining warnings : %d",
                    "errors_embed_description": "You cannot remove %d warnings at %s otherwise it will be at %d warnings!"
                },

                "errors" : {
                    "no_entries_in_database": "You have not configured your server!\nPlease ask %s to use the command g!setup",
                    "bad_language": "Bad language please retry the commande with the language fr or en",
                    "kick_me_or_owner": "You can't evict yourself or the owner of the server %s!",
                    "ban_me_or_owner": "You cannot banish yourself or banish the owner of the server %s!",
                    "unban_me_or_owner": "You can't unban yourself or unban the server owner %s!",
                    "user_not_found": "The user was not found!",
                    "no_banned_users": "No user has been banned on the server %s!",
                    "feedback_error": "You have already sent your notice for the bot %s or you have not configured your server!"

                    },

                "success": {
                    "modify_language_sucess": "The language %s has been defined as your main language on your server %s"
                },

                "help": {
                    "title_embed": "Assistance requested by %s",
                    "description_embed": "9 orders are available! \n\n __**Fun's commands**__ \n\n g!me : Allows you to view your profile on the concerned server \n g!server : Allows to see the statistics of the concerned server \n g!user @user : Allows to see the profile of the mentioned user in the mentioned server \n\n __**Main Command's**__ \n\n g!clear number: Allows to delete the written number of messages in the channel. \n g!help : Allows you to see all the commands of the bot \n g!modify_language language: Allows you to modify the language of the bot \n g!unwarn @user reason number: Allows to remove an x number from a user \n g!warn @user reason: Allows to warn a user \n\n __**Setup Command**__ \n\n g!setup #channel_ticket language: Allows you to configure the ticket channel and choose the bot language (default: English)."
                },

                "mute": {
                    "user_has_mute_role": "The user %s already has the role %s!",
                    "embed_title": "The %s user has been silenced!",
                    "embed_description": "%s silenced %s!",
                    "fields": {
                        "title": "Moderator:",
                        "value": "%s",
                        "title_two": "Reason:",
                        "value_two": "%s"
                    }
                },

                "unmute": {
                    "user_hasnt_mute_role": "The user %s does not have the role %s!",
                    "embed_title": "The right to speak in %s has been restored!",
                    "embed_description": "%s has restored %s right to speak!",
                    "fields": {
                        "title": "Moderator :",
                        "value": "%s",
                        "title_two": "Reason :",
                        "value_two": "%s"
                    }
                },

                "kick": {
                    "embed_title": "%s expelled %s from server %s",
                    "embed_description": "%s has been expelled from the server!",
                    "fields": {
                        "title": "Moderator :",
                        "value": "%s",
                        "title_two": "Reason:",
                        "value_two": "%s"
                    },
                    "user": {
                        "embed_title": "You have been evicted!",
                        "embed_description": "%s kicked you off the %s server!"
                    }
                },

                "ban": {
                    "embed_title": "%s has banned %s from server %s",
                    "embed_description": "%s has been banned from the server!",
                    "fields": {
                        "title": "Moderator",
                        "value": "%s",
                        "title_two": "Reason:",
                        "value_two": "%s"
                    },
                    "user": {
                        "embed_title": "You have been banned!",
                        "embed_description": "%s banned you from the %s server !"
                    }
                },

                "unban": {
                    "first_title": "%s unbaned someone!",
                    "embed_title": "%s has been unbanned from server %s",
                    "embed_description": "%s a débanni(e) %s of the server!",
                    "fields": {
                        "title": "Moderator : ",
                        "value": "%s"
                    }
                },

                "notice": {
                    "thank_you_for_feedback": "Thanks for your feedback!"
                }
            }
        }
    }
}
```