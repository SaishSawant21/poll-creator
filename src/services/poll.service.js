import { db } from './../prisma/db';
import { appError } from './../lib/errors';
import { isValidPoll, isValidPollStatus, isValidOptionId } from './../lib/validators';
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
			creatorId,
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
		.where({
			status: 'open',
			visibility: 'public'
		})
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

export const castVote = async ({ slug, optionId, userId, voterToken }) => {
	if (!isValidOptionId(optionId)) {
		throw appError('INVALID_INPUT', 'A valid optionId is required');
	}

	const poll = await db.orm.public.Poll
		.where({ slug: slug })
		.include('options')
		.first();

	if (!poll) throw appError('POLL_NOT_FOUND', 'Poll not found');

	if (poll.status !== 'open') {
		throw appError('POLL_CLOSED', 'This poll is not open for voting');
	}
	if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
		throw appError('POLL_EXPIRED', 'This poll has expired');
	}

	if (poll.votingMode === 'login_required' && !userId) {
		throw appError('LOGIN_REQUIRED', 'You must be logged in to vote on this poll');
	}

	const optionBelongsToPoll = poll.options.some((opt) => opt.id === optionId);
	if (!optionBelongsToPoll) {
		throw appError('INVALID_OPTION', 'This option does not belong to this poll');
	}

	let finalUserId = null;
	let finalVoterToken = null;
	let newTokenForGuest = null;

	if (userId) {
		finalUserId = userId;
	} else {
		finalVoterToken = voterToken || crypto.randomBytes(16).toString('hex');
		if (!voterToken) {
			newTokenForGuest = finalVoterToken; 
		}
	}


	try {
		const voteData = {
			pollId: poll.id,
			optionId: optionId,
			...(finalUserId ? { userId: finalUserId } : {}),
			...(finalVoterToken ? { voterToken: finalVoterToken } : {}),
		};

		await db.orm.public.Vote.create(voteData);

	} catch (error) {
		if (error.code === '23505' || error.message?.includes('unique constraint')) {
			throw appError('ALREADY_VOTED', 'You have already voted on this poll');
		}
		if (error.code === '23514') {
			throw appError('INVALID_IDENTITY', 'Voting identity violation');
		}
		throw error;
	}

	return { newTokenForGuest };
};

export const getPollResults = async (slug) => {
	const poll = await db.orm.public.Poll
		.where({ slug: slug })
		.select('id', 'question', 'status') 
		.include('options', (options) => 
			options
				.select('id', 'text', 'position') 
				.orderBy((opt) => opt.position.asc())
				.include('votes', (votes) => votes.select('id'))
		)
		.first();

	if (!poll) {
		throw appError('POLL_NOT_FOUND', 'Poll not found');
	}
	
	let totalVotes = 0;
	const formattedOptions = poll.options.map((option) => {
		const voteCount = option.votes.length;
		totalVotes += voteCount;
		return {
			text: option.text,
			votes: voteCount,
		};
	});

	return {
		question: poll.question,
		status: poll.status,
		totalVotes: totalVotes,
		options: formattedOptions,
	};
};

export const getUserPolls = async (creatorId) => {
	const polls = await db.orm.public.Poll
		.where({ creatorId })
		.select('id', 'question', 'slug', 'status', 'createdAt')
		.include('votes', (votes) => votes.select('id')) // Include votes to count them
		.orderBy((poll) => poll.createdAt.desc())
		.all();

	return polls.map((poll) => {
		const { votes, ...pollData } = poll;
		return {
			...pollData,
			voteCount: votes?.length || 0,
		};
	});
};

export const checkIfVoted = async (pollId, userId, voterToken) => {
	if (!userId && !voterToken) return false;

	const vote = await db.orm.public.Vote
		.where(
			userId
				? { pollId, userId }
				: { pollId, voterToken }
		)
		.first();

	return !!vote;
};