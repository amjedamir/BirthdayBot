require("dotenv").config();
const{ Client, MessageEmbed, MessageAttachment} = require('discord.js');
const mongoose = require('mongoose');
const client = new Client();
const server = require('./databases/server');
const userinfo = require('./databases/userInformation')
var url = "mongodb connect string";
var _prefix = "$";


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log('[Birthday] Bot is connected to the databases')
  })
  .catch((err) => {
    console.error(err);
});


client.on('ready', () => {
    console.log(`[ ${client.user.username} ] : Bot is connected to the discord website `);
    client.user.setActivity('Happy', ({type: "WATCHING"}))
})

client.on('guildCreate',(guild) => {
    const ServerDate = new server({
        id : guild.id,
        ownerid : guild.ownerID,
        birthday_channel : "",
        prefix : _prefix,
        banned : false,
    })
    ServerDate.save((err,req) => {
        if(err) return;
        if(req) return console.log(req)
    })
})

client.on('guildDelete',(guild) => {
    server.deleteOne({id:guild.id},() => {})
})


function sendBirthDayMsg() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let _all = month + "-" + day
    userinfo.find({userDate:_all},(err,reqAll) => {
        server.find({},(erre,reqeAll) => {
            for (const reqe of reqeAll) {
                const check = client.guilds.cache.get(reqe.id);
                const channel = client.channels.cache.get(reqe.birthday_channel)
                for (const req of reqAll) {
                    const user = client.users.cache.get(req.id)
                    if(check.member(user.id)) {
                        channel.send('Happy Birthday to you '+ user.tag + "\n it's the **" + date.getFullYear() + _all + "** :D")
                    }
                }
            }
        })
    })
}

setInterval(sendBirthDayMsg,24*60*60*1000);

client.on('message',message => {
    if(message.author.bot == false) {
        const user = message.mentions.users.first();
        server.findOne({id:message.guild.id},(err,pre) => {
            const prefix = pre.prefix;
            if(message.content.startsWith(prefix)) {
                const args = message.content.slice(prefix.length).trim().split(' ');
                const cmd = args.shift().toLowerCase();
                if(message.member.hasPermission('ADMINISTRATOR')) {
                    if(cmd == 'config') {
                        const _id = message.channel.id
                        server.updateOne({id:message.guild.id},{$set : {birthday_channel : _id}},(err,req) => {
                            if(err) return message.channel.send('Error');
                            if(req) {
                                message.channel.send("Birthday **Channel** Updated ! \n ID : **" + message.channel.id + "**")
                            }
                        })
                    }
                    if(cmd == "prefix") {
                        if(!args[0].length <= 0) {
                            _prefix = args[0];
                            server.updateOne({id:message.guild.id},{$set : {prefix : _prefix}},(err,noterr) => {
                                message.channel.send('Updated The **prefix** !!! \n Prefix : **' + _prefix + '**')
                            })    
                        }else {
                            message.channel.send("The prefix can't have no letters")
                        }
                    }
                }else {
                    message.channel.send("Sorry you don't have permission to do that")
                }
                if(cmd == "birthday") {
                    userinfo.findOne({userId: message.author.id},(err,res) => {
                        if(err) return;
                        if(res) {
                            let _date = new Date();
                            if(args[0] > _date.getFullYear() && args[0].length == 4) return message.channel.send("we are in **" + _date.getFullYear() + "** You can't select this year");
                            if(args[1] > 12 || args[1] < 0) return message.channel.send('In this world we have 12 months :O')
                            if(args[2] > 31 || args[1] < 1) return message.channel.send('We have only 31 days lol');
                            if(args[0] && args[1] && args[2] ) {
                                const _alldate = args[1] + "-" + args[2]
                                userinfo.updateOne({userId : message.author.id},{$set : {userDate : _alldate}},(urr,ure) => {
                                    message.channel.send('**Your Birthday Date Updated !!**')
                                })
                            }
                        }else {
                            const _user = new userinfo({
                                userId : message.author.id,
                                userDate : args[0] + "-" + args[1] + "-" + args[2],
                            })
                            _user.save((errq,resq) => {
                                if(errq) return;
                                if(resq) {
                                    message.channel.send('**Your Birthday Date Updated !!**')
                                    console.log(resq)
                                }
                            })
                        }
                    })
                }
            }
        })
    }
})







client.login(TOKEN);
