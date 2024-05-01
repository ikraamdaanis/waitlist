import { ObjectId } from "bson";

export interface Booking<ID = ObjectId, A = ObjectId> {
  _id?: ID;
  name: string;
  email: string;
  isWaitlisted?: boolean;
  activity: A;
  createdAt: Date;
}
