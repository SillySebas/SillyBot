const Discord = require('discord.js');
const { prefix, giphyToken } = require('./config.json');
const client = new Discord.Client();

var GphApiClient = require('giphy-js-sdk-core')
giphy = GphApiClient(giphyToken)

client.once('ready', () => {
    console.log('Ready!');
});

//Commands

client.on("guildMemberAdd", function(member){
    member.reply(member);
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    let role = member.guild.roles.find(role => role.name === "Member");
    member.addRole(role);
    member.reply(channel);
    member.reply(role);
    member.reply(member);
});

client.on('message', message => {
    let interval;
    //Administrative Commands
    if(message.member.hasPermission(['ADMINISTRATOR']))
    {   
        /*Kick Commands
        * Kicks User From Server
        */
        if(message.content.startsWith(`ping`))
        {
            message.reply("pong");
        }
        if(message.content.startsWith(`${prefix}giphy`))
        {
            let search = message.content.substring(6);

            giphy.search('gifs', {"q": `${search}`}).then((response) => {
                let totalResponses = response.data.length;
                let responseIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
                let responseFinal = response.data[responseIndex];

                message.channel.send(`> ${search} Gif`, {
                    files: [responseFinal.images.fixed_height.url]
                });
            }).catch(() => {
                message.channel.send('Error! No Gif Today!');
            });

            if(message.content.length <= 6)
            {
                message.channel.send('> :no_entry_sign: Incorrect Value :no_entry_sign:');
                message.channel.send('> !giphy {search term} \n> - Returns Random Gif Based On Search Term');
            }
        }

        if(message.content.startsWith(`${prefix}kick`))
        {
            let member = message.mentions.members.first();

            
            try{
                member.kick().then((member) => 
                {
                    giphy.search('gifs', {"q": "fail"}).then((response) => {
                        let totalResponses = response.data.length;
                        let responseIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
                        let responseFinal = response.data[responseIndex];

                        message.channel.send(`> User ${member} Has Been Kicked:skull:`, {
                            files: [responseFinal.images.fixed_height.url]
                        });
                    }).catch(() => {
                        message.channel.send('Error! No Gif Today!');
                    });
                })
            }
            catch{
                message.channel.send(`> :no_entry_sign: No User By Name ${message.content.substring(6)}`)
            }
        }

        /*Ban Command
        * Bans User From Server
        */
        if(message.content.startsWith(`${prefix}ban`))
        {
            
            let member = message.mentions.members.first();

            try{
                member.ban().then((member) => 
                {
                    giphy.search('gifs', {"q": "leave"}).then((response) => {
                        let totalResponses = response.data.length;
                        let responseIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
                        let responseFinal = response.data[responseIndex];

                        message.channel.send(`> User ${member} Has Been Banned:skull:`, {
                            files: [responseFinal.images.fixed_height.url]
                        });
                    }).catch(() => {
                        message.channel.send('Error! No Gif Today!');
                    });
                })
            }
            catch{
                message.channel.send(`> :no_entry_sign: No User By Name ${message.content.substring(6)}`)
            }
        }

        if(message.content.startsWith(`${prefix}removemessage`))
        {
            if(message.content.length > 14)
            {
                try{
                    let remove = parseInt(message.content.substring(14));

                    if(!Number.isInteger(remove))
                    {
                        message.channel.send(`> Invalid Value, Must Be A Number`)
                    }
                    else if(remove>100)
                    {
                        message.channel.send(`> Too Many Messages Selected (Max 100)`)
                    }
                    else if(remove<1)
                    {
                        message.channel.send(`> Not Enough Messages Selected (Min 1)`)
                    }
                    else
                    {   
                        message.channel.messages.fetch({ limit: remove+1 }).then(messages => {
                            message.channel.bulkDelete(messages)
                        }).catch(() => {
                            message.channel.messages.fetch().then(messages => {
                                message.channel.bulkDelete(messages)
                            });
                        });

                        message.channel.send(`> ${remove} Message(s) Removed`)

                        interval = setInterval(() => {
                            message.channel.lastMessage.delete();
                            clearInterval(interval);
                        }, 1500);
                    }
                }catch
                {
                    message.channel.send(`> Error`)
                }
                
            }
            else
            {
                message.channel.messages.fetch({ limit: 2 }).then(messages => {
                    message.channel.bulkDelete(messages)
                }).catch(() => {
                    message.channel.messages.delete();
                });
                message.channel.send(`> Last Message Removed`)
                interval = setInterval(() => {
                    message.channel.lastMessage.delete();
                    clearInterval(interval);
                }, 1500);
                
            }
        }
    }
    else
    {
        message.channel.send(`> :no_entry_sign: Command Require Permission Level : ADMINISTRATOR`)
    }
});

client.on

client.login(process.env.BOT_TOKEN);
