import dbConnect from './Mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { Jobs } from '../models/ContractJob';

export async function GetEmployerJobCount(): Promise<number> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return 0;
  }

  await dbConnect();

  const count = await Jobs.countDocuments({ postedBy: session.user.id });
  return count;
}
