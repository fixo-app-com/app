import { render } from "@testing-library/react-native";
import { FullScreenLoader } from "./FullScreenLoader";

describe("FullScreenLoader", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<FullScreenLoader />);
    const tree = toJSON();
    expect(tree).not.toBeNull();
  });

  it("contains an ActivityIndicator", () => {
    const { toJSON } = render(<FullScreenLoader />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain("ActivityIndicator");
  });
});
