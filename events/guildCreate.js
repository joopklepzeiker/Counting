module.exports = async (client, guild) => {

    await client.counts.create({
        guild: guild.name,
        guildid: guild.id,
    });

};