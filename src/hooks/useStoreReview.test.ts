import { renderHook, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { useStoreReview } from "./useStoreReview";

jest.mock("expo-store-review", () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  requestReview: jest.fn(() => Promise.resolve()),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockIsAvailable = StoreReview.isAvailableAsync as jest.Mock;
const mockRequestReview = StoreReview.requestReview as jest.Mock;

describe("useStoreReview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAvailable.mockResolvedValue(true);
  });

  it("increments count and stores it in AsyncStorage", async () => {
    mockGetItem.mockResolvedValue(null);

    const { result } = renderHook(() => useStoreReview());

    await act(() => result.current.promptIfEligible());

    expect(mockSetItem).toHaveBeenCalledWith("@fixo/expense_count", "1");
  });

  it("increments from existing count", async () => {
    mockGetItem.mockResolvedValue("7");

    const { result } = renderHook(() => useStoreReview());

    await act(() => result.current.promptIfEligible());

    expect(mockSetItem).toHaveBeenCalledWith("@fixo/expense_count", "8");
  });

  it.each([3, 9, 15])("requests review at threshold %i", async (threshold) => {
    mockGetItem.mockResolvedValue(String(threshold - 1));

    const { result } = renderHook(() => useStoreReview());

    await act(() => result.current.promptIfEligible());

    expect(mockRequestReview).toHaveBeenCalledTimes(1);
  });

  it("does not request review between thresholds", async () => {
    mockGetItem.mockResolvedValue("4");

    const { result } = renderHook(() => useStoreReview());

    await act(() => result.current.promptIfEligible());

    expect(mockRequestReview).not.toHaveBeenCalled();
  });

  it("does not request review after last threshold", async () => {
    mockGetItem.mockResolvedValue("20");

    const { result } = renderHook(() => useStoreReview());

    await act(() => result.current.promptIfEligible());

    expect(mockRequestReview).not.toHaveBeenCalled();
  });

  it("does not request review when store review is unavailable", async () => {
    mockGetItem.mockResolvedValue("2");
    mockIsAvailable.mockResolvedValue(false);

    const { result } = renderHook(() => useStoreReview());

    await act(() => result.current.promptIfEligible());

    expect(mockRequestReview).not.toHaveBeenCalled();
  });

  it("silently catches errors", async () => {
    mockGetItem.mockRejectedValue(new Error("storage fail"));

    const { result } = renderHook(() => useStoreReview());

    await expect(
      act(() => result.current.promptIfEligible()),
    ).resolves.not.toThrow();
  });
});
