import { ObjectId } from "bson";

export interface Activity<ID = ObjectId> {
  _id: ID;
  name: string;
  imageSrc: string;
  imageAlt: string;
  date: Date;
  price: number;
  placeLimit: number;
  sales: number;
}
