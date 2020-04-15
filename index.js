const Discord = require('discord.js');
const got = require('got');

const auth = require('./auth');

const client = new Discord.Client();

client.on('ready', () => {
    client.user.setActivity('my life pass by', { type: 'WATCHING' });
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    if (message.content.startsWith('!r')) {
        const command = message.content.split('!r ')[1];

        if (!command) {
            fallback(message);
        } else if (command.startsWith('help')) {
            help(message);
        } else if (command.startsWith('dice')) {
            dice(message, command);
        } else if (command.startsWith('number')) {
            number(message, command);
        } else if (command === 'bible') {
            bible(message);
        } else if (command === 'cat') {
            cat(message);
        } else if (command === 'fact') {
            fact(message);
        } else {
            fallback(message);
        }
    }
});

client.login(auth.token).catch(console.error);

function help(message) {
    const help = '`!r dice <maximum value>:` Roll a dice\n'
    + '`!r number <inclusive minimum> <exclusive maximum>:` Get a random number\n'
    + '`!r bible:` Get a random bible verse\n'
    + '`!r cat:` Get a random cat picture\n'
    + '`!r fact:` Get a random fact about a number\n';

    const embed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Randomizer')
    .setURL('https://github.com/schollsebastian/Randomizer-Discord-Bot')
    .addField('Help', help);

    message.channel.send(embed);
}

function dice(message, command) {
    let dice = parseInt(command.split(' ')[1]);
    dice = dice ? Math.floor(dice) : 6;

    if (dice > 0) {
        const random = Math.floor(Math.random() * dice) + 1;
        message.channel.send(`<@${message.author.id}> you rolled a **\`${random}\`** with a d${dice}`).catch(console.error);
    } else {
        message.channel.send(`<@${message.author.id}> do i really have to explain dice to you?`).catch(console.error);
    }
}

function number(message, command) {
    let min = parseInt(command.split(' ')[1]);
    let max = parseInt(command.split(' ')[2]);

    if (min && max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        if (max > min) {
            const random = Math.floor(Math.random() * (max - min)) + min;
            message.channel.send(`<@${message.author.id}> a random number between \`${min}\` and \`${max}\`: **\`${random}\`**`).catch(console.error);
        } else {
            message.channel.send(`<@${message.author.id}> my life is already bad enough so please spare me with your stupidity.`).catch(console.error);
        }
    } else {
        message.channel.send(`<@${message.author.id}> do you seriously not know what between means or do you just want to see me suffer?`).catch(console.error);
    }
}

function bible(message) {
    got.get('http://labs.bible.org/api/?passage=random').then(response => {
        let verse = response.body;
        
        verse = verse.replace('<b>', '**');
        verse = verse.replace('</b>', '**:');

        message.channel.send(`<@${message.author.id}> ${verse}`);
    }).catch(console.error);
}

function cat(message) {
    message.channel.send(`<@${message.author.id}> https://cataas.com/cat?cacheBuster=${Date.now()}`).catch(console.error);
}

function fact(message) {
    let urls = ['trivia', 'math'];

    got.get(`http://numbersapi.com/random/${urls[Math.floor(Math.random() * 2)]}`).then(response => {
        message.channel.send(`<@${message.author.id}> ${response.body}`).catch(console.error);
    });
}

function fallback(message) {
    message.channel.send(`<@${message.author.id}> my only purpose in this world is to entertain bored people. So if you would be so kind and tell me at least what I should it would make my existence a lot less painful.`)
        .catch(console.error);
}