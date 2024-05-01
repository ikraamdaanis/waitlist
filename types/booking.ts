import { ObjectId } from "bson";

export interface Booking<ID = ObjectId, A = ObjectId> {
  _id?: ID;
  name: string;
  email: string;
  activity: A;
  createdAt: Date;
}
