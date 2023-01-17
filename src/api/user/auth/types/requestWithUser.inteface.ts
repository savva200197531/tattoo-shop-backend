import { User } from "@/api/user/entities/user.entity";

interface RequestWithUser {
  user: User
}

export default RequestWithUser;
