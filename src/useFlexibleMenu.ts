import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function getFittingItems(
  container: HTMLUListElement,
  moreItemWidth: number
): number {
  const spaceTarget = Math.ceil(container.offsetWidth);

  const children = Array.from(container.children);
  const sizes = children.map((li) => li.getBoundingClientRect());

  let spaceUsed = 0;

  for (let i = 0; i < sizes.length; i++) {
    const itemWidth = Math.ceil(sizes[i].width);

    if (spaceUsed + itemWidth > spaceTarget) {
      let slicePosition = i;

      while (spaceUsed + moreItemWidth > spaceTarget) {
        spaceUsed -= Math.ceil(sizes[slicePosition].width);
        slicePosition--;
      }

      return slicePosition;
    }

    spaceUsed += itemWidth;
  }

  return -1;
}

interface State {
  itemHeight: number;
  moreWidth: number;
  slicePosition: number;
}

export default function useFlexibleMenu({ items }: { items: any[] }) {
  const [state, setState] = useState<State>({
    slicePosition: 0,
    itemHeight: 0,
    moreWidth: 0,
  });

  const ghostRef = useRef<HTMLUListElement>(null);
  const moreRef = useRef<HTMLLIElement>(null);

  const calculate = useDebouncedCallback(() => {
    if (!ghostRef.current || !moreRef.current) return;

    const moreWidth = Math.ceil(moreRef.current.getBoundingClientRect().width);

    const slicePosition = getFittingItems(ghostRef.current, moreWidth);

    const firstItem = ghostRef.current.children[0];
    const firstItemHeight = firstItem
      ? Math.ceil(firstItem.getBoundingClientRect().height)
      : 0;

    setState({
      itemHeight: firstItemHeight,
      slicePosition,
      moreWidth,
    });
  }, 100);

  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [calculate, items]);

  const visibleItems =
    state.slicePosition === -1 ? items : items.slice(0, state.slicePosition);
  const overflowItems =
    state.slicePosition === -1 ? [] : items.slice(state.slicePosition);

  return {
    ghostRef,
    moreRef,
    visibleItems,
    overflowItems,
    height: state.itemHeight,
  };
}
