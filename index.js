const Discord = require('discord.js');

const auth = require('./auth');

const client = new Discord.Client();

client.on('ready', () => {
    client.user.setActivity('my life pass by', { type: 'WATCHING' });
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    if (message.content.startsWith('!random')) {
        const maxNumber = parseInt(message.content.split(' ')[1]);

        if (maxNumber) {
            const random = Math.floor(Math.random() * maxNumber + 1);
            message.channel.send(`<@${message.author.id}> a random number between \`1\` and \`${maxNumber}\`: **\`${random}\`**`).catch(console.error);
        } else {
            message.channel.send('My only purpose in this world is to give people who are too lazy to google a random number. So if you would be so kind and give me at least the maximum value it would make my existence a lot less painful.')
                .catch(console.error);
        }

        message.delete({ timeout: 5000 }).catch(console.error);
    }
});

client.login(auth.token).catch(console.error);