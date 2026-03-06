import { fireEvent, render, screen } from "@testing-library/react-native";
import { SaveDeleteFooter } from "./SaveDeleteFooter";

describe("SaveDeleteFooter", () => {
  it("renders save button", () => {
    render(<SaveDeleteFooter saveLabel="Save" onSave={jest.fn()} />);
    expect(screen.getByText("Save")).toBeOnTheScreen();
  });

  it("renders delete button when provided", () => {
    render(
      <SaveDeleteFooter
        saveLabel="Save"
        onSave={jest.fn()}
        deleteLabel="Delete"
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Delete")).toBeOnTheScreen();
  });

  it("does not render delete button when not provided", () => {
    render(<SaveDeleteFooter saveLabel="Save" onSave={jest.fn()} />);
    expect(screen.queryByText("Delete")).toBeNull();
  });

  it("calls onSave when save is pressed", () => {
    const onSave = jest.fn();
    render(<SaveDeleteFooter saveLabel="Save" onSave={onSave} />);
    fireEvent.press(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete is pressed", () => {
    const onDelete = jest.fn();
    render(
      <SaveDeleteFooter
        saveLabel="Save"
        onSave={jest.fn()}
        deleteLabel="Delete"
        onDelete={onDelete}
      />,
    );
    fireEvent.press(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
