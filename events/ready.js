module.exports = async (client) => {

    console.log(`${client.user.tag} succesfully logged in!`);
    client.counts.sync();
    client.guilds.forEach(async (guild) => {
        let guildc = await client.counts.findOne({ where: { guildid: guild.id } });
        if (!guildc) {
            await client.counts.create({
                guild: guild.name,
                guildid: guild.id
            });
        }
    });
    client.user.setPresence({
        activity: {
            name: '+setup',
            type: 'PLAYING'
        },
        status: 'online'
    });

};