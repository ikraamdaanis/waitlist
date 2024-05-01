import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Booking } from "../../types/booking";
import clientPromise from "../../lib/mongodb";

/**
 * POST Endpoint for creating bookings. Throws an error if the request method
 * is not POST or if there was a problem creating the booking.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const client = await clientPromise;
    const db = client.db();
    const bookings = db.collection<Booking>("bookings");

    try {
      const { activity, name, email, isWaitlisted } = JSON.parse(req.body);
      await bookings.insertOne({
        activity: ObjectId.createFromHexString(activity),
        name,
        email,
        isWaitlisted,
        createdAt: new Date(),
      });
      res.status(201).json({ message: "Booking created" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error creating booking" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
