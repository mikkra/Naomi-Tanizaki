const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Issue = require('../../models/Issue');

module.exports = class ResetIssuesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'issue-reset',
			group: 'bot',
			memberName: 'issue-reset',
			description: '`AL: owner` Reset the issues data table.',
			guarded: true,

			args: [
				{
					key: 'confirmation',
					prompt: 'are you sure you want to reset the issue data table?\n',
					type: 'string',
					validate: confirmation => {
						if (!/^(?:yes|y|-y)$/g.test(confirmation)) {
							return `
								please confirm the reset of the data table with either \`yes\`, \`y\`, or \`-y\`
							`;
						}
						return true;
					}
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	run(msg) {
		Issue.sync({ force: true });
		return msg.embed({
			color: _sdata.colors.green,
			description: `${msg.author}, 'the issue data table has been reset.`
		});
	}
};
