import React from "react";
import { View } from "react-native";

/* eslint-disable @typescript-eslint/no-explicit-any */
function MockDraggableFlatList(props: any) {
  const {
    data = [],
    renderItem,
    keyExtractor,
    ItemSeparatorComponent,
    ListHeaderComponent,
  } = props;
  const header = ListHeaderComponent ? (
    React.isValidElement(ListHeaderComponent) ? (
      ListHeaderComponent
    ) : (
      <ListHeaderComponent />
    )
  ) : null;
  return (
    <View>
      {header}
      {data.map((item: any, index: number) => (
        <React.Fragment
          key={keyExtractor ? keyExtractor(item, index) : String(index)}
        >
          {index > 0 && ItemSeparatorComponent ? (
            <ItemSeparatorComponent />
          ) : null}
          {renderItem({
            item,
            getIndex: () => index,
            drag: () => {},
            isActive: false,
          })}
        </React.Fragment>
      ))}
    </View>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default MockDraggableFlatList;
export const ScaleDecorator = ({ children }: { children: React.ReactNode }) =>
  children;
export const OpacityDecorator = ({ children }: { children: React.ReactNode }) =>
  children;
