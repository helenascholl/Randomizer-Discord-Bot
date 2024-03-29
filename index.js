const Discord = require('discord.js');
const got = require('got');

const client = new Discord.Client();

client.on('ready', () => {
    client.user.setActivity('my life pass by', { type: 'WATCHING' });
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    if (message.content.startsWith('!r ')) {
        const command = message.content.split('!r ')[1];

        if (!command) {
            fallback(message);
        } else if (command === 'help') {
            help(message);
        } else if (command.startsWith('dice')) {
            dice(message, command);
        } else if (command.startsWith('number')) {
            number(message, command);
        } else if (command === 'bible') {
            bible(message);
        } else if (command === 'cat') {
            cat(message);
        } else if (command === 'dog') {
            dog(message);
        } else if (command === 'fact') {
            fact(message);
        } else if (command === 'nsfw') {
            nsfw(message);
        } else if (command.startsWith('insult')) {
            insult(message, command);
        } else if (command === 'dadjoke') {
            dadjoke(message);
        } else if (command === 'wikipedia') {
            wikipedia(message);
        } else if (command === 'kanye') {
            kanye(message);
        } else if (command === 'trump') {
            trump(message);
        } else {
            fallback(message);
        }
    }
});

client.login(process.env['DISCORD_TOKEN']).catch(console.error);

function help(message) {
    const help = '`!r dice <maximum value>:` Roll a dice\n'
    + '`!r number <minimum> <maximum>:` Get a random number\n'
    + '`!r bible:` Get a random bible verse\n'
    + '`!r cat:` Get a random cat picture\n'
    + '`!r dog:` Get a random dog picture\n'
    + '`!r fact:` Get a random fact about a number\n'
    + '`!r insult <name>:` Get a random insult\n'
    + '`!r dadjoke:` Get a random dad joke\n'
    + '`!r wikipedia:` Get a random Wikipedia-Article\n'
    + '`!r kanye:` Get a random Kanye West quote\n'
    + '`!r trump:` Get a random Donald Trump quote';

    const embed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Randomizer')
    .setURL('https://github.com/schollsebastian/Randomizer-Discord-Bot')
    .addField('Help', help);

    message.channel.send(embed).catch(console.error);
}

function dice(message, command) {
    let dice = parseInt(command.split(' ')[1]);

    if (!dice && dice != 0) {
        dice = 6;
    } else {
        dice = Math.floor(dice);
    }

    if (dice > 0) {
        const random = Math.floor(Math.random() * dice) + 1;
        message.channel.send(`<@${message.author.id}> you rolled a **\`${random}\`** with a d${dice}`)
            .catch(console.error);
    } else if (dice == 0) {
        message.channel.send(`<@${message.author.id}> Congratulations! You just won a mention in my suicide note!`)
            .catch(console.error);
    } else {
        message.channel.send(`<@${message.author.id}> do i really have to explain a dice to you?`)
            .catch(console.error);
    }
}

function number(message, command) {
    let min = Math.ceil(parseInt(command.split(' ')[1]));
    let max = Math.floor(parseInt(command.split(' ')[2]));

    if (
        (min && max
        || (min && max == 0 || max && min == 0))
        && max > min
    ) {
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        message.channel.send(`<@${message.author.id}> a random number between \`${min}\` and \`${max}\`: **\`${random}\`**`)
            .catch(console.error);
    } else {
        message.channel.send(`<@${message.author.id}> my life is already bad enough so please spare me with your stupidity.`)
            .catch(console.error);
    }
}

function bible(message) {
    got.get('http://labs.bible.org/api/?passage=random').then(response => {
        let verse = response.body;
        
        verse = verse.replace('<b>', '**');
        verse = verse.replace('</b>', '**:');

        message.channel.send(`<@${message.author.id}> ${verse}`).catch(console.error);
    }).catch(console.error);
}

function cat(message) {
    message.channel.send(`<@${message.author.id}>`, {
        files: [{
            attachment: `https://cataas.com/cat?cacheBuster=${Date.now()}`,
            name: 'cat.jpg'
        }]
    }).catch(console.error);
}

function dog(message) {
    got.get('https://dog.ceo/api/breeds/image/random').then(response => {
        message.channel.send(`<@${message.author.id}>`, {
            files: [{
                attachment: JSON.parse(response.body).message,
                name: 'dog.jpg'
            }]
        }).catch(console.error);
    });
}

function fact(message) {
    let urls = ['trivia', 'math'];

    got.get(`http://numbersapi.com/random/${urls[Math.floor(Math.random() * 2)]}`).then(response => {
        message.channel.send(`<@${message.author.id}> ${response.body}`).catch(console.error);
    });
}

function nsfw(message) {
    if (message.channel.nsfw) {
        got.get('https://api.ksoft.si/images/random-nsfw', {
            headers: { 'Authorization': `Bearer ${process.env['KSOFT_API_TOKEN']}` }
        }).then(response => {
            message.channel.send(`<@${message.author.id}> ${JSON.parse(response.body).image_url}`)
              .catch(console.error);
        }).catch(console.error);
    } else {
        message.channel.send(`<@${message.author.id}> are you aware that there's an invention called the internet?`)
            .catch(console.error);
    }
}

function insult(message, command) {
    let url = 'https://insult.mattbas.org/api/insult';
    let name = command.split(' ')[1];

    if (name && name.startsWith('<@') && name.endsWith('>')) {
        url += `?who=*`;

        got.get(url, { headers: { 'Content-Type': 'text/json' } }).then(response => {
            message.channel.send(response.body.replace('*', name))
                .catch(console.error);
        }).catch(console.error);
    } else {
        got.get(url, { headers: { 'Content-Type': 'text/json' } }).then(response => {
            message.channel.send(`<@${message.author.id}> ${response.body}`)
                .catch(console.error);
        }).catch(console.error);
    }
}

function dadjoke(message) {
    got.get('https://icanhazdadjoke.com', { headers: { 'Accept': 'application/json' } })
        .then(response => {
            message.channel.send(`<@${message.author.id}> ${JSON.parse(response.body).joke}`)
                .catch(console.error);
        }).catch(console.error);
}

function wikipedia(message) {
    got.get('https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&format=json').then(response => {
        const article = `https://en.wikipedia.org/wiki/${JSON.parse(response.body).query.random[0].title.replace(/ /g, '_')}`;

        message.channel.send(`<@${message.author.id}> ${article}`)
            .catch(console.error);
    }).catch(console.error);
}

function kanye(message) {
    got.get('https://api.kanye.rest').then(response => {
        message.channel.send(`<@${message.author.id}> ${JSON.parse(response.body).quote}`)
            .catch(console.error);
    }).catch(console.error);
}

function trump(message) {
    got.get('https://www.tronalddump.io/random/quote', { headers: { 'Accept': 'application/json' } })
        .then(response => {
            message.channel.send(`<@${message.author.id}> ${JSON.parse(response.body).value}`)
                .catch(console.error);
        }).catch(console.error);
}

function fallback(message) {
    message.channel.send(`<@${message.author.id}> my only purpose in this world is to entertain bored people. So if you would be so kind and tell me at least what I should it would make my existence a lot less painful.`)
        .catch(console.error);
}