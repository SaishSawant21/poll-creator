import {db} from './../prisma/db';
import { appError } from './../lib/errors';
import { isValidPoll } from './../lib/validators';
import crypto from 'crypto';

export const createPoll = async (creatorId, data) => {
	if(!isValidPoll(data)) {
		throw appError('INVALID_POLL_DATA', 'Poll must have a question and at least 2 options');
	}

	const { question, options, description, visibility, votingMode} = data;

	const slug = crypto.randomBytes(4).toString('hex');
	const newPoll = await db.orm.public.Poll
		.create({
			question,
			description: description || null,
			slug,
			visibility: visibility ? visibility.toLowerCase() : 'public', // Force lowercase
			votingMode: votingMode ? votingMode.toLowerCase() : 'anyone', // Force lowercase
			status: 'draft', // <-- Change this to lowercase
			creatorId,
		})

	const pollOptions = options.map((text, index) => ({
		text,
		position: index,
		pollId: newPoll.id, // Note: depending on your exact RC version, Prisma might handle the relation mapping differently. If this fails, see the alternative below.
	}));

	// Use createMany instead of create for arrays
	await db.orm.public.PollOption.createAll(pollOptions);

	return newPoll;
}