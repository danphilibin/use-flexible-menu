import { CSSProperties } from "react";
import useFlexibleMenu from "./useFlexibleMenu";

interface FlexibleMenuProps<T> {
  items: T[];
  itemRenderer: (item: T, index: number) => React.ReactNode;
  debug?: boolean;
  menuClassName?: string;
  moreButton?: (
    overflowItems: T[],
    moreRef?: ReturnType<typeof useFlexibleMenu>["moreRef"]
  ) => React.ReactNode;
}

type Visibility = "visible" | "ghost";

export default function FlexibleMenu<T>(props: FlexibleMenuProps<T>) {
  const {
    items,
    itemRenderer,
    debug = false,
    menuClassName = "",
    moreButton = () => null,
  } = props;

  const { visibleItems, overflowItems, ghostRef, moreRef, height } =
    useFlexibleMenu({
      items,
    });

  const menuStyles: Record<Visibility, CSSProperties> = {
    visible: {
      height,
    },
    ghost: {
      position: "absolute",
      visibility: "hidden",
      top: 0,
      left: 0,
    },
  };

  const vis: Visibility[] = ["visible", "ghost"];

  return (
    <div style={{ position: "relative" }}>
      {vis.map((v) => {
        const renderItems = v === "ghost" ? items : visibleItems;

        return (
          <ul
            ref={v === "ghost" ? ghostRef : undefined}
            key={v}
            style={{
              display: "flex",
              alignItems: "stretch",
              flexWrap: "wrap",
              overflow: "hidden",
              width: "100%",
              ...menuStyles[v],
            }}
            className={menuClassName}
          >
            {renderItems.map(itemRenderer)}
            {v === "visible" &&
              overflowItems.length > 0 &&
              moreButton(overflowItems, moreRef)}
          </ul>
        );
      })}

      {debug && (
        <div className="mt-8 font-mono text-left text-sm">
          <p>Total items: {items.length}</p>
          <p>Visible: {visibleItems.length}</p>
          <p>Hidden: {overflowItems.length}</p>
          <p className="mt-4">
            Hidden items:{` `}
            {overflowItems.length > 0 ? overflowItems.join(", ") : "none"}
          </p>
        </div>
      )}
    </div>
  );
}
