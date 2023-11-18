import { useState } from "react";
import { Menu, MenuButton, MenuItem, useMenuState } from "ariakit";
import FlexibleMenu from "./FlexibleMenu";
import classNames from "classnames";

const foods = [
  "Pizza",
  "Burger",
  "Risotto",
  "Pasta",
  "Salad",
  "Cereal",
  "Steak",
  "Tacos",
  "Sushi",
  "Curry",
  "Sandwich",
  "Soup",
  "Sushi",
  "Pasta",
  "Curry",
];

function WithTitle() {
  const [items, setItems] = useState(foods);

  const menu = useMenuState();

  return (
    <div className="text-left py-12 max-w-[50%] mx-auto">
      <div className="bg-gray-50 flex items-center">
        <h1 className="flex-1 whitespace-nowrap">Test title</h1>
        <div className="flex-0 flex justify-end">
          <FlexibleMenu
            height={40}
            debug={false}
            items={items}
            itemRenderer={({ data, isVisible }, idx) => (
              <li
                className={classNames(
                  "whitespace-nowrap flex items-center py-2 px-3",
                  {
                    "invisible absolute top-0 left-0 pointer-events-none":
                      !isVisible,
                  }
                )}
                key={idx}
              >
                {data}
              </li>
            )}
            moreButtonRenderer={({ isVisible, moreRef }) => (
              <MenuButton
                state={menu}
                as="li"
                className={classNames(
                  "whitespace-no-wrap flex items-center py-2 px-3",
                  {
                    "absolute top-0 left-0 invisible pointer-events-none":
                      !isVisible,
                  }
                )}
                ref={moreRef}
              >
                More &darr;
              </MenuButton>
            )}
            overflowRenderer={({ overflowItems }) => (
              <Menu state={menu} className="bg-white p-1 shadow-md rounded-md">
                {overflowItems.map((item, idx) => (
                  <MenuItem
                    key={idx}
                    className="block py-1.5 px-2 focus:bg-gray-50"
                  >
                    {item}
                  </MenuItem>
                ))}
              </Menu>
            )}
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          className="border px-2 mr-2 border-black"
          onClick={() =>
            setItems((prev) => [
              ...prev,
              foods[Math.floor(Math.random() * foods.length)],
            ])
          }
        >
          Add item
        </button>
        <button
          className="border px-2 mr-2 border-black"
          onClick={() => setItems((prev) => prev.slice(0, -1))}
        >
          Remove item
        </button>
      </div>
    </div>
  );
}

function RightAligned() {
  const [items, setItems] = useState(foods);

  const menu = useMenuState();

  return (
    <div className="text-left py-12 max-w-[50%] mx-auto">
      <div className="bg-gray-50">
        <FlexibleMenu
          height={40}
          debug={false}
          items={items}
          direction="rtl"
          itemRenderer={({ data, isVisible }, idx) => (
            <li
              className={classNames(
                "whitespace-no-wrap flex items-center py-2 px-3",
                {
                  "invisible absolute top-0 left-0 pointer-events-none":
                    !isVisible,
                }
              )}
              key={idx}
            >
              {data}
            </li>
          )}
          moreButtonRenderer={({ isVisible, moreRef }) => (
            <MenuButton
              state={menu}
              as="li"
              className={classNames(
                "whitespace-no-wrap flex items-center py-2 px-3",
                {
                  "absolute top-0 left-0 invisible pointer-events-none":
                    !isVisible,
                }
              )}
              ref={moreRef}
            >
              More &darr;
            </MenuButton>
          )}
          overflowRenderer={({ overflowItems }) => (
            <Menu state={menu} className="bg-white p-1 shadow-md rounded-md">
              {overflowItems.map((item, idx) => (
                <MenuItem
                  key={idx}
                  className="block py-1.5 px-2 focus:bg-gray-50"
                >
                  {item}
                </MenuItem>
              ))}
            </Menu>
          )}
        />
      </div>

      <div className="mt-4">
        <button
          className="border px-2 mr-2 border-black"
          onClick={() =>
            setItems((prev) => [
              ...prev,
              foods[Math.floor(Math.random() * foods.length)],
            ])
          }
        >
          Add item
        </button>
        <button
          className="border px-2 mr-2 border-black"
          onClick={() => setItems((prev) => prev.slice(0, -1))}
        >
          Remove item
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <WithTitle />
      <RightAligned />
    </div>
  );
}

export default App;
