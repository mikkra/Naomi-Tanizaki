const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
module.exports = class WhitelistUserCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'whitelist-user',
            aliases: ['whitelist'],
            group: 'util',
            memberName: 'whitelist-user',
            description: '`AL: full` Remove a user from the blacklist',
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'user',
                    prompt: 'what user should get removed from the blacklist?\n',
                    type: 'user'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
   || this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.full;
    }

    run(msg, { user }) {
        const blacklist = this.client.provider.get('global', 'userBlacklist', []);
        if (!blacklist.includes(user.id)) {
            return msg.embed({
                color: _sdata.colors.blue,
                description: `${msg.author}, that user is not blacklisted.
                `
            });
        }

        const index = blacklist.indexOf(user.id);
        blacklist.splice(index, 1);

        if (blacklist.length === 0) this.client.provider.remove('global', 'userBlacklist');
        else this.client.provider.set('global', 'userBlacklist', blacklist);
        return msg.embed({
            color: _sdata.colors.green,
            description: `${msg.author}, ${user.username}#${user.discriminator} has been removed from the blacklist.`
        });
    }
};
