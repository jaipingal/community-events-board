import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import ReminderButton from "@/components/ReminderButton";
import authReducer from "@/store/authSlice";
import * as api from "@/lib/api";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, getReminder: vi.fn(), setReminder: vi.fn() };
});

const loggedInStore = () =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: { id: 1, name: "Jai", email: "jai@example.com", role: "USER" as const },
        token: "token",
        loading: false,
      },
    },
  });

const renderButton = () =>
  render(
    <Provider store={loggedInStore()}>
      <ReminderButton eventId={7} />
    </Provider>,
  );

describe("ReminderButton", () => {
  beforeEach(() => {
    vi.mocked(api.getReminder).mockReset();
    vi.mocked(api.setReminder).mockReset();
    vi.mocked(api.getReminder).mockResolvedValue({ reminder: false });
  });

  it("loads the saved reminder state", async () => {
    vi.mocked(api.getReminder).mockResolvedValue({ reminder: true });
    renderButton();

    expect(await screen.findByRole("button", { name: /reminder on/i })).toBeInTheDocument();
  });

  it("turns on immediately and stays on when the request succeeds", async () => {
    let finish: (value: { reminder: boolean }) => void = () => {};
    vi.mocked(api.setReminder).mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );

    renderButton();
    await userEvent.click(await screen.findByRole("button", { name: /remind me/i }));

    expect(screen.getByRole("button", { name: /reminder on/i })).toBeInTheDocument();

    finish({ reminder: true });
    await waitFor(() => expect(screen.getByRole("button")).not.toBeDisabled());
    expect(screen.getByRole("button", { name: /reminder on/i })).toBeInTheDocument();
    expect(api.setReminder).toHaveBeenCalledWith("token", 7, true);
  });

  it("rolls back and shows an error when the request fails", async () => {
    vi.mocked(api.setReminder).mockRejectedValue(new Error("Network down"));

    renderButton();
    await userEvent.click(await screen.findByRole("button", { name: /remind me/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not update/i);
    expect(screen.getByRole("button", { name: /remind me/i })).toBeInTheDocument();
  });

  it("uses the state passed in by a list without fetching it again", async () => {
    render(
      <Provider store={loggedInStore()}>
        <ReminderButton eventId={7} initial compact />
      </Provider>,
    );

    expect(await screen.findByRole("button", { name: /reminder on/i })).toBeInTheDocument();
    expect(api.getReminder).not.toHaveBeenCalled();
  });

  it("shows a Remind me link on cards for logged-out visitors", () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { user: null, token: null, loading: false } },
    });

    render(
      <Provider store={store}>
        <ReminderButton eventId={7} compact />
      </Provider>,
    );

    expect(screen.getByRole("link", { name: /remind me/i })).toHaveAttribute("href", "/login");
  });

  it("asks logged-out visitors to log in", () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { user: null, token: null, loading: false } },
    });

    render(
      <Provider store={store}>
        <ReminderButton eventId={7} />
      </Provider>,
    );

    expect(screen.getByRole("link", { name: /log in to set a reminder/i })).toBeInTheDocument();
  });
});
