const { MessageEmbed } = require('discord.js');

module.exports = async (client, message) => {

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let guild = await client.counts.findOne({ where: { guildid: message.guild.id } });
    if (!guild) {
        await client.counts.create({
            guild: message.guild.name,
            guildid: message.guild.id
        });
    }

    if (message.channel.id == guild.channel && message.content != guild.count + 1) {
        return message.delete();
    } else if (message.channel.id == guild.channel && message.content == guild.count + 1) {
        if (guild.lastUser == message.author.id) return message.delete();
        guild.increment('count');
        await guild.update({ lastUser: message.author.id }, { where: { guildid: message.guild.id } });
    }

    if (!message.content.startsWith(client.config.prefix)) return;

    let messageArray = message.content.split(' ');
    let command = message.content.split(' ')[0].slice(client.config.prefix.length).toLowerCase();
    let args = messageArray.slice(1);

    let commands;
    if (client.commands.has(command)) {
        commands = client.commands.get(command)
    } else if (client.aliases.has(command)) {
        commands = client.commands.get(client.aliases.get(command));
    }

    if (commands) {
        commands.run(client, message, args, MessageEmbed, guild);
    }
};