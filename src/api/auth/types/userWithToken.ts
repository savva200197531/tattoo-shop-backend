import { User } from "@/api/user/entities/user.entity";

export interface UserWithToken { user: User, token: string }
