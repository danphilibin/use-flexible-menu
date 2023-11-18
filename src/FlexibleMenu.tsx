import useResizeObserver from "@react-hook/resize-observer";
import { useCallback, useEffect, useRef, useState } from "react";

function getFittingItems(
  container: HTMLUListElement,
  moreItemWidth: number
): number {
  const spaceTarget = Math.ceil(container.offsetWidth);

  const children = Array.from(container.children).filter(
    // TODO: better detection of More button?
    (child) => child.getAttribute("role") !== "button"
  );
  const sizes = children.map((li) => li.getBoundingClientRect());

  let spaceUsed = 0;

  for (let i = 0; i < sizes.length; i++) {
    const itemWidth = Math.ceil(sizes[i].width);

    if (spaceUsed + itemWidth > spaceTarget) {
      // the current item does not fit; start with the previous item
      let slicePosition = Math.max(0, i - 1);

      while (spaceUsed + moreItemWidth > spaceTarget) {
        spaceUsed -= Math.ceil(sizes[slicePosition].width);
        slicePosition--;
        if (slicePosition < 0) break;
      }

      return slicePosition;
    }

    spaceUsed += itemWidth;
  }

  return -1;
}

function getIsVisible(slicePosition: number | undefined, index: number) {
  // not calculated yet
  if (slicePosition === undefined) return false;

  // all items are visible
  if (slicePosition === -1) return true;

  return slicePosition >= index;
}

interface FlexibleMenuState {
  itemHeight: number;
  moreWidth: number;
  slicePosition: number | undefined;
}

function useFlexibleMenu({ items }: { items: any[] }) {
  const [state, setState] = useState<FlexibleMenuState>({
    slicePosition: undefined,
    itemHeight: 0,
    moreWidth: 0,
  });

  const navRef = useRef<HTMLUListElement>(null);
  const moreRef = useRef<HTMLLIElement>(null);

  const calculate = useCallback(() => {
    if (!navRef.current) return;

    const moreWidth = Math.ceil(
      moreRef.current?.getBoundingClientRect().width ?? 0
    );

    const slicePosition = getFittingItems(navRef.current, moreWidth);

    const firstItem = navRef.current.children[0];
    const firstItemHeight = firstItem
      ? Math.ceil(firstItem.getBoundingClientRect().height)
      : 0;

    setState({
      itemHeight: firstItemHeight,
      slicePosition,
      moreWidth,
    });
  }, []);

  useResizeObserver(navRef, calculate);

  useEffect(calculate, [items, calculate]);

  const overflowItems =
    state.slicePosition === undefined || state.slicePosition === -1
      ? []
      : items.slice(state.slicePosition + 1);

  return {
    navRef,
    moreRef,
    overflowItems,
    height: state.itemHeight,
    slicePosition: state.slicePosition,
  };
}

interface FlexibleMenuProps<T> {
  // required; prevents individual items from resizing the parent container
  // and triggering an infinite ResizeObserver loop
  height: number;
  items: T[];
  itemRenderer: (
    item: {
      data: T;
      isVisible: boolean;
    },
    index: number
  ) => React.ReactNode;
  debug?: boolean;
  menuClassName?: string;
  direction?: "ltr" | "rtl";
  moreButtonRenderer: (args: {
    moreRef?: ReturnType<typeof useFlexibleMenu>["moreRef"];
    isVisible: boolean;
  }) => React.ReactNode;
  overflowRenderer: (args: { overflowItems: T[] }) => React.ReactNode;
}

// TODO: does not work with flexible-width containers, because
// every time we hide items the container resizes and ResizeObserver recalculates.

export default function FlexibleMenu<T>(props: FlexibleMenuProps<T>) {
  const {
    height,
    items,
    itemRenderer,
    direction = "ltr",
    debug = true,
    menuClassName = "",
    moreButtonRenderer,
  } = props;

  const { overflowItems, navRef, moreRef, slicePosition } = useFlexibleMenu({
    items,
  });

  return (
    <>
      <ul
        ref={navRef}
        style={{
          display: "flex",
          alignItems: "stretch",
          flexWrap: "wrap",
          overflow: "hidden",
          width: "100%",
          justifyContent: direction === "ltr" ? "start" : "end",
          flexDirection: direction === "ltr" ? "row" : "row-reverse",
          // height is important; prevents us from ever seeing a second row
          height,
          visibility: slicePosition === undefined ? "hidden" : "visible",
        }}
        className={menuClassName}
      >
        {items.map((data, idx) =>
          itemRenderer(
            {
              data,
              isVisible: getIsVisible(slicePosition, idx),
            },
            idx
          )
        )}
        {moreButtonRenderer({
          isVisible:
            slicePosition !== undefined &&
            slicePosition !== -1 &&
            items.length > slicePosition + 1,
          moreRef,
        })}
      </ul>

      {overflowItems.length > 0 && props.overflowRenderer({ overflowItems })}

      {debug && (
        <div className="mt-8 font-mono text-left text-sm">
          <p>Total items: {items.length}</p>
          <p>Hidden: {overflowItems.length}</p>
          <p>slicePosition: {slicePosition}</p>
          <p className="mt-4">
            Hidden items:{` `}
            {overflowItems.length > 0 ? overflowItems.join(", ") : "none"}
          </p>
        </div>
      )}
    </>
  );
}
