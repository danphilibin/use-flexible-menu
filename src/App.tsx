import { useState } from "react";
import { Menu, MenuButton, MenuItem, useMenuState } from "ariakit";
import FlexibleMenu from "./FlexibleMenu";

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

function App() {
  const [items, setItems] = useState(foods);

  const menu = useMenuState();

  return (
    <div className="text-left py-12 max-w-[50%] mx-auto">
      <div className="bg-gray-50">
        <FlexibleMenu
          items={items}
          itemRenderer={(item, idx) => (
            <li
              className="whitespace-no-wrap flex items-center py-2 px-3"
              key={idx}
            >
              {item}
            </li>
          )}
          moreButton={(overflowItems, moreRef) => (
            <>
              <MenuButton
                state={menu}
                as="li"
                className="whitespace-no-wrap flex items-center py-2 px-3"
                ref={moreRef}
              >
                More &darr;
              </MenuButton>
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
            </>
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

export default App;
