import { connectToDB } from '@utils/database';
import User from '@models/user';

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const prompts = await User.findById(params.id);
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch all propmts', { status: 500 });
  }
};
