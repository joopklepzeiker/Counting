module.exports.run = async (client, message, args, MessageEmbed, guild) => {

    if (guild.setup == true) return message.channel.send(`Heya ${message.author}, everything is already setup!`);

    let channel = message.guild.channels.find(c => c.name == 'counting');
    if (!channel) channel = await message.guild.channels.create('counting', { type: 'text' });
    await channel.send('1');
    await guild.update({ count: 1, setup: true, channel: channel.id }, { where: { guildid: message.guild.id } });
    message.channel.send(`Heya ${message.author}, everything is setup and ready to count!\nYou can send one number in a row so after every number someone else needs to count further.`);
};

module.exports.help = {
    name: 'setup',
    aliases: []
};