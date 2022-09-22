const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { Tatsu } = require('tatsu');
const { readFileSync, writeFileSync } = require('fs');

const tatsu = new Tatsu('Q6EWLNtiZI-lBbxLXQLoiD1myInRiqJT5');

// const userRegex = /<@([^}]+)>/g;

class TatsuTest extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'tatsu';
        this.aliases = ['tt'];

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

    async execute({msg }) {
        msg.channel.createMessage('yuh')
        try {
            await tatsu.addGuildMemberScore(msg.guildID, msg.author.id, 5); // Adds score to Tatsu
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = TatsuTest;