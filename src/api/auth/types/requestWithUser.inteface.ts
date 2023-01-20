import { User } from "@/api/user/entities/user.entity";

interface RequestWithUser extends Request {
  user: User
}

export default RequestWithUser;
