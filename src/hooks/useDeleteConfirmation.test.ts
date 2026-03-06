import { renderHook, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useDeleteConfirmation } from "./useDeleteConfirmation";

jest.spyOn(Alert, "alert");

describe("useDeleteConfirmation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows an alert with cancel and delete buttons", () => {
    const { result } = renderHook(() => useDeleteConfirmation());
    const onConfirm = jest.fn();

    act(() => {
      result.current.confirmDelete({
        title: "Delete?",
        message: "Are you sure?",
        onConfirm,
      });
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Delete?",
      "Are you sure?",
      expect.arrayContaining([
        expect.objectContaining({ text: "common.cancel", style: "cancel" }),
        expect.objectContaining({ text: "common.delete", style: "destructive" }),
      ]),
    );
  });
});
