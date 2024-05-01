import clientPromise from "../lib/mongodb";
import { Activity } from "../types/activity";
import Bookings from "../components/Bookings";
import Tabs from "../components/Tabs";
import { Booking } from "../types/booking";
import Header from "../components/Header";

export const getServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db();

    const activities = await db.collection("activities").find({}).toArray();
    const bookings = await db
      .collection("bookings")
      .find({}, { sort: { createdAt: -1 } })
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
