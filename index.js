const Discord = require('discord.js');

const auth = require('./auth');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    if (message.content.startsWith('!random')) {
        const maxNumber = parseInt(message.content.split(' ')[1]);

        if (maxNumber) {
            message.channel.send(Math.floor(Math.random() * maxNumber + 1));
        } else {
            message.channel.send('My only purpose in this world is to give people who are too lazy to google a random number. So if you would be so kind and give me at least the maximum value it would make my existence a lot less painful.');
        }
    }
});

client.login(auth.token);