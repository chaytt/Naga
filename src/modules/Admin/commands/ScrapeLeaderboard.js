const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { Tatsu } = require('tatsu');

const tatsu = new Tatsu('Q6EWLNtiZI-lBbxLXQLoiD1myInRiqJT5');

// const userRegex = /<@([^}]+)>/g;

class ScrapeLeaderboard extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'scrapelb';
        this.aliases = [
            'exportleaderboard',
            'exportlb',
            'slb',
            'scrapeleaderboard'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'scrapelb',
            description: 'Scrapes xp data from a Carl leaderboard embed',
            usage: 'scrapelb [message id]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute({msg, args }) {

        // let messages = [ '1013630746809880678', '1013630758465831075', '1013630770352488488', '1013630781597438053', '1013630792481656862', 
        // '1013630802506043402', '1013630815869087844', '1013630824702292008', '1013630859657625601', '1013630872890650674' ]; // I have no idea how we're going to do the whole thing lmao

        try {

            let messages = await this.bot.getChannel('1013630721774059550').getMessages();
            this.sendSuccess(msg.channel, `Exporting the Carl leaderboard to Tatsu.\nEstimated time: **${~~(20 * messages.length * (2000 / 1000))} seconds**`)

            messages = messages.reverse(); // Reverse the message array, transfer the top of the leaderboard first

            for (let a in messages) {
                if (messages[a].author.id === '235148962103951360') {

                    let message = messages[a];
                    message = message.embeds[0].description;
                    message = message.split('\n')
                    let newmessage;
                    msg.channel.createMessage(`__**Leaderboard Page ${parseInt(messages[a].embeds[0].footer.text.slice(4, -5))}**__`);
                    for (let i in message) {
                        newmessage = message[i].split(' ');
                        newmessage.pop();
                        newmessage.pop();
                        newmessage.shift();
                        // newmessage = message[i].slice(4);
                        newmessage[0] = newmessage[0].replace(/<@|>/g, '') // .slice(0, -9).replace(',', '').split(' ')
                        newmessage[1] = newmessage[1].replace(',', '').replace('xp', '');
                        newmessage[1] = newmessage[1].replace(',', '');

                        let member = await this.bot.getRESTUser(newmessage[0])

                        let embed = {
                            color: this.utils.getColor('green'),
                            description: `Transferring **${parseInt(newmessage[1]).toLocaleString()}** XP for **${member.username}#${member.discriminator}**.`,
                            footer: { text: `ID: ${member.id}` },
                            timestamp: new Date()
                        }
                        
                        msg.channel.createMessage({embed})

                        tatsu.addGuildMemberScore(msg.guildID, newmessage[0]. parseInt(newmessage[1])); // Adds score to Tatsu
                            
                        // msg.channel.createMessage(`\`${newmessage.toString()}\``);
                        await this.utils.delayFor(2000); // Delays function to avoid getting ratelimited by Tatsu
                    }
                }
            }
        } catch (err) {
            this.sendError(msg.channel, err);
        };
    }
}

module.exports = ScrapeLeaderboard;