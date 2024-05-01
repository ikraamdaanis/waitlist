import { NextApiRequest } from "next";
import Bookings from "../components/Bookings";
import Header from "../components/Header";
import Tabs, { WAITING_LIST_TAB } from "../components/Tabs";
import clientPromise from "../lib/mongodb";
import { Activity } from "../types/activity";
import { Booking } from "../types/booking";

/**
 * It also associates each booking with its corresponding activity object.
 * Fetches the activities and bookings. If we're in the waitinglist tab, it
 * will only fetch bookings on the waiting list. The corresponding activities
 * are added to the bookings object.
 */
export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Checking if there is a waitinglist search parameter
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const isWaitingListTab = url.searchParams.get("tab") === WAITING_LIST_TAB;

    // Get filtered bookings depending on which tab we're in.
    const bookingsQuery = isWaitingListTab
      ? { isWaitlisted: true }
      : // Not all documents have the isWaitlisted field so we should include those
        // that don't have it. In production we'd update all documents eventually.
        {
          $or: [{ isWaitlisted: { $exists: false } }, { isWaitlisted: false }],
        };

    const activities = await db.collection("activities").find({}).toArray();
    const bookings = await db
      .collection("bookings")
      .find(bookingsQuery, { sort: { createdAt: -1 } })
      .toArray();

    for (const booking of bookings) {
      const activity = activities.find(
        (activity) => activity._id.toString() === booking.activity.toString()
      );
      booking.activity = activity;
    }

    return {
      props: {
        bookings: JSON.parse(JSON.stringify(bookings)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { bookings: [] },
    };
  }
};

interface AdminProps {
  bookings: Booking<string, Activity>[];
}

/**
 * Displays the bookings and waiting list tables.
 */
const Admin = ({ bookings }: AdminProps) => {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <Tabs />
              <Bookings bookings={bookings} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
