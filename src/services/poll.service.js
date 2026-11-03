import { db } from './../prisma/db';
import { appError } from './../lib/errors';
import { isValidPoll, isValidPollStatus } from './../lib/validators';
import crypto from 'crypto';

export const createPoll = async (creatorId, data) => {
	if (!isValidPoll(data)) {
		throw appError('INVALID_POLL_DATA', 'Poll must have a question and at least 2 options');
	}

	const { question, options, description, visibility, votingMode } = data;

	const slug = crypto.randomBytes(4).toString('hex');
	const newPoll = await db.orm.public.Poll
		.create({
			question,
			description: description || null,
			slug,
			visibility: visibility ? visibility.toLowerCase() : 'public', // Force lowercase
			votingMode: votingMode ? votingMode.toLowerCase() : 'anyone', // Force lowercase
			status: 'draft',
		})

	const pollOptions = options.map((text, index) => ({
		text,
		position: index,
		pollId: newPoll.id,
	}));

	await db.orm.public.PollOption.createAll(pollOptions);

	return newPoll;
}

export const updatePollStatus = async (creatorId, slug, newStatus) => {
	const normalizedStatus = typeof newStatus === 'string' ? newStatus.toLowerCase() : '';

	if (!isValidPollStatus(normalizedStatus)) {
		throw appError('INVALID_STATUS', 'Status must be open or closed');
	}

	// 2. Find the poll by slug
	const poll = await db.orm.public.Poll
		.where({ slug: slug })
		.first();

	if (!poll) {
		throw appError('POLL_NOT_FOUND', 'Poll not found');
	}

	if (poll.creatorId !== creatorId) {
		throw appError('FORBIDDEN', 'You are not the creator of this poll');
	}

	const updatedPoll = await db.orm.public.Poll
		.where({ slug: slug })
		.update({
			status: normalizedStatus,
			updatedAt: new Date().toISOString() // or whatever format your TimestamptzString expects
		});

	return updatedPoll;
};

export const getPublicPolls = async () => {
	const polls = await db.orm.public.Poll
		// .where({
		// 	status: 'open',
		// 	visibility: 'public'
		// })
		.select('id', 'question', 'slug', 'description', 'createdAt')
		.orderBy((poll) => poll.createdAt.desc())
		.all();


	return polls;
};

export const getPollBySlug = async (slug) => {
	const poll = await db.orm.public.Poll
		.where({ slug: slug })
		.include('options', (options) =>
			options.orderBy((opt) => opt.position.asc())
		)
		.first();

	if (!poll) {
		throw appError('POLL_NOT_FOUND', 'Poll not found');
	}

	return poll;
};