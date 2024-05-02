import { fireEvent, render, waitFor } from "@testing-library/react";
import BookNow from "../BookNow";
import { Activity } from "../../types/activity";

jest.mock("next/router", () => ({
  useRouter: () => ({
    reload: jest.fn(),
  }),
}));

describe("BookNow Component", () => {
  const activityMock: Activity<string> = {
    _id: "test_id",
    date: new Date(),
    imageAlt: "test_alt",
    imageSrc: "test_src",
    name: "test_name",
    placeLimit: 10,
    price: 1,
    sales: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    const { getByText } = render(
      <BookNow activity={activityMock} open={true} setOpen={() => {}} />
    );

    expect(getByText("Almost there!")).toBeDefined();
  });

  test("modal opens when open prop is true", () => {
    const { getByText } = render(
      <BookNow activity={activityMock} open={true} setOpen={() => {}} />
    );

    expect(getByText("Almost there!")).toBeInTheDocument();
  });

  test("modal shouldn't be visible if it's not open", () => {
    const { queryByText } = render(
      <BookNow activity={activityMock} open={false} setOpen={() => {}} />
    );

    expect(queryByText("Almost there!")).toBeNull();
  });

  test("form submission sends correct data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true })
    ) as unknown as typeof fetch;
    const mockSetOpen = jest.fn();

    const { getByLabelText, getByText } = render(
      <BookNow activity={activityMock} open={true} setOpen={mockSetOpen} />
    );
    const nameInput = getByLabelText("Name");
    const emailInput = getByLabelText("Email");
    const submitButton = getByText("Book now");

    fireEvent.change(nameInput, { target: { value: "test" } });
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          activity: activityMock._id,
          name: "test",
          isWaitlisted: false,
          email: "test@test.com",
        }),
      });
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  test("displays error message alert if the fetch call is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false })
    ) as unknown as typeof fetch;
    window.alert = jest.fn();

    const { getByLabelText, getByText } = render(
      <BookNow activity={activityMock} open={true} setOpen={() => {}} />
    );
    const nameInput = getByLabelText("Name");
    const emailInput = getByLabelText("Email");
    const submitButton = getByText("Book now");

    fireEvent.change(nameInput, { target: { value: "test" } });
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          activity: activityMock._id,
          name: "test",
          isWaitlisted: false,
          email: "test@test.com",
        }),
      });
    });

    expect(window.alert).toHaveBeenCalledWith(
      "An error occurred. Please try again."
    );
  });
});
