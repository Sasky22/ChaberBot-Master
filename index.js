const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const PREFIX = "&"

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL (server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
      if (server.queue[0]) play(connection, message);
      else connection.disconnect();
  });
}

var fortunes = [
    "https://image.ceneostatic.pl/data/products/59950278/i-fiat-ducato-kamper-2-8-jtd.jpg"
];

var bot = new Discord.Client();

var servers = {};



bot.on('ready', () => {
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
    bot.user.setStatus('available') // Can be 'available', 'idle', 'dnd', or 'invisible'
    bot.user.setPresence({
        game: {
            name: `ww.DiscordsBots.gq: ${bot.guilds.size} `,
            type: 0
        }
    });
});

bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.user.setStatus('available') // Can be 'available', 'idle', 'dnd', or 'invisible'
    bot.user.setPresence({
        game: {
            name: `ww.DiscordsBots.gq: ${bot.guilds.size}`,
            type: 0
        }
    });
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setStatus('available') // Can be 'available', 'idle', 'dnd', or 'invisible'
    bot.user.setPresence({
        game: {
            name: `www.DiscordsBots.gq: ${bot.guilds.size}`,
            type: 0
        }
    });
});

bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  if (message.content == "&camper 1") {
      message.channel.send(`KAMPERRRR` , {files: ["https://image.ceneostatic.pl/data/products/59950278/i-fiat-ducato-kamper-2-8-jtd.jpg"]});
  }
  if (message.content == "&camper") {
    message.channel.send("Camper help: \n&camper 1 \n&camper 2 \n&music \n&help");
  }
  if (message.content == "&camper 2") {
      message.channel.send(`KAMPERRRR` , {files: ["https://thumbs.img-sprzedajemy.pl/1000x901c/3e/66/85/kamper-nieuszkodzony-bytom-324563022.jpg"]});
  }

});

bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  if (!message.content.startsWith(PREFIX)) return;

  var args = message.content.substring(PREFIX.length).split(" ");

  switch (args[0]) {
      case "music":
        message.channel.send("```Hi my name is ChaberBot \nThanks for using me :) \nMy task is to play music \nI hope you will be happy with my work \nBye :) \n© DiscordsBots.gq - DragonFM```");
        break;
      case "help":
        message.channel.send("```Komendy dla ChaberBot: \n& is prefix \n&play (link) \n&stop \n&skip \n&info \n&help \n© DiscordsBots.gq - ChaberBot````");
        break;
      case "play":
        if (!args[1]) {
            message.channel.send("Podaj link !");
            return;
        }

        if(!message.member.voiceChannel) {
          message.channel.send("Ic do kanalu glosowego !");
          return;
        }

        if(!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }

        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
            play(connection, message);
        });
        break;
      case "skip":
        var server = servers[message.guild.id];

        if (server.dispatcher) server.dispatcher.end();
        break;
      case "stop":
        var server = servers[message.guild.id];

        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
        break;
  }
});

bot.login(process.env.TOKEN);
