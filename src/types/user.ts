import { User } from '../user/entities/user.entity.js';

export type TailUserForToken = Pick<User, 'id' | 'email'>;
