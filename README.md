# Viewport Scroll

A simple and lightweight React component to effortlessly track the window's viewport-scroll position and trigger actions like infinite scrolling.

![Viewport Scroll Demo](https://i.imgur.com/YOUR_DEMO_IMAGE.gif)  <!-- Replace with an actual demo GIF -->

---

## ✨ Features

*   **Easy to use:** Simply wrap your content with the `ViewportScroll` component.
*   **Performant:** Uses a single scroll listener to track the viewport position.
*   **Customizable:** Control the scroll threshold and loading state.
*   **Asynchronous actions:** Easily trigger async functions when the scroll threshold is reached.
*   **TypeScript support:** Fully typed for a better development experience.

---

## 📦 Installation

```bash
npm install viewport-scroll
```

or

```bash
yarn add viewport-scroll
```

---

## 🚀 Usage

Here's a simple example of how to use `ViewportScroll` to implement infinite scrolling:

```jsx
import ViewportScroll, { type ScrollHandlerType } from "viewport-scroll";
import { useState } from "react";

type State = {
   isLoading: boolean;
   data: {
      id: number;
      name: string;
   }[];
};

export default function App() {
   const [user, setUser] = useState<State>({ isLoading: false, data: [] });

   const getCharacter: ScrollHandlerType = async ({ page, setHasMore }) => {
      try {
         setUser((prev) => ({ ...prev, isLoading: true }));
         await new Promise((resolve) => setTimeout(resolve, 1000));
         const data = await (await fetch(`https://rickandmortyapi.com/api/character?page=${page}`)).json();
         const results = data?.results ?? [];
         if (results.length === 0 || !data.info?.next) {
            setHasMore(false);
         }
         setUser((prev) => ({ isLoading: false, data: [...prev.data, ...results] }));
      } catch (error) {
         setUser((prev) => ({ ...prev, isLoading: false }));
         setHasMore(false);
      }
   };

   return (
      <div className="App">
         <h1>Infinite Scroll with ViewportScroll</h1>
         <ViewportScroll
            threshold={200}
            isLoading={user.isLoading}
            asyncHandler={getCharacter}
            style={{ height: "400px", width: "80%", overflowY: "auto", margin: "auto", border: "1px solid #ccc", padding: "1rem" }}
         >
            {user.data.map((char) => (
               <div key={char.id} style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
                  <h3>{char.name}</h3>
               </div>
            ))}
            {user.isLoading && <div style={{ textAlign: "center", padding: "1rem" }}>Loading more characters...</div>}
         </ViewportScroll>
      </div>
   );
}
```

---

## ⚙️ Props

| Prop         | Type                                        | Default | Description                                                                                             |
|--------------|---------------------------------------------|---------|---------------------------------------------------------------------------------------------------------|
| `threshold`  | `number`                                    | `200`   | The distance in pixels from the bottom of the scrollable element at which the `asyncHandler` is triggered. |
| `isLoading`  | `boolean`                                   | `false` | A boolean to indicate if the `asyncHandler` is currently running. This prevents multiple calls.         |
| `asyncHandler` | `({ page, setHasMore }) => Promise<void>` | -       | The asynchronous function to call when the scroll threshold is reached.                                 |
| `style`      | `React.CSSProperties`                       | -       | Custom styles to apply to the scrollable container.                                                     |
| `children`   | `React.ReactNode`                           | -       | The content to be rendered inside the scrollable container.                                             |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/riteshmyhub/viewport-scroll/issues).

---

## 📝 License

This project is [ISC](./LICENSE) licensed.