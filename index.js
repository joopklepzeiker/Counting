const { Client, Collection } = require('discord.js');
const config = require('./data/config/config.json');
const fs = require('fs');
const Sequelize = require('sequelize');
const client = new Client();

const database = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './data/database.sqlite',
})

const counts = database.define('counts', {
    guild: Sequelize.STRING,
    guildid: Sequelize.STRING,
    lastUser: {
        type: Sequelize.STRING,
        defaultValue: '0',
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    setup: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    channel: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0
    }
});

client.commands = new Collection();
client.aliases = new Collection();
client.config = config;
client.counts = counts;

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(f => {
        const event = require(`./events/${f}`);
        let eventName = f.split('.')[0];
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir('./commands/', (err, files) => {
    if (err) console.log(err);
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) { return console.log('No commands found...') }
    else if (jsfile.length == 1) {
        console.log('1 command found!')
    } else {
        { console.log(jsfile.length + ' commands found!') }
    }
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        client.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.login(client.config.token);