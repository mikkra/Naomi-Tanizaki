const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const _sdata = require('../../assets/_data/static_data.json');
const Tag = require('../../models/Tag');

module.exports = class TagListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-list',
			aliases: ['tags', 'list-tag', 'ahh'],
			group: 'tags',
			memberName: 'list',
			description: '`AL: low` Lists all server tags.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run(msg) {
		const tags = await Tag.findAll({ where: { guildID: msg.guild.id } });
		if (!tags) {
			return msg.embed({
				color: _sdata.colors.blue,
				description: `${msg.guild.name} doesn't have any tags, ${msg.author}. Why not add one?`
			});
		}
		const examples = tags.filter(tag => tag.type)
			.filter(tag => tag.example)
			.map(tag => tag.name)
			.sort()
			.join(', ');
		const usertags = tags.filter(tag => !tag.type)
			.filter(tag => tag.userID === msg.author.id)
			.map(tag => tag.name)
			.sort()
			.join(', ');
		return msg.embed({
			color: _sdata.colors.blue,
			description: stripIndents`**❯ Tags:**
			${tags.filter(tag => tag.type)
				.filter(tag => !tag.example)
				.map(tag => tag.name)
				.sort()
				.join(', ')}

			${examples ? `**❯ Examples:**
				${examples}` : `There are no examples.`}

			${usertags ? `**❯ ${msg.member.displayName}'s tags:**
				${usertags}` : `${msg.member.displayName} has no tags.`}`
		});
	}
};
