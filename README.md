# viewport-scroll

A simple React component to track the window's viewport-scroll position.

## Installation

```bash
npm install viewport-scroll
```

## Usage

```jsx
import ViewportScroll, { type ScrollHandlerType } from "viewport-scroll";
import { useState } from "react";

type State = {
   isLoading: boolean,
   data: {
      id: number,
      name: string,
   }[],
};

const style = {
   height: "97vh",
   width: "80%",
   overflowY: "auto",
   margin: "auto",
};
export default function Component() {
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
      <ViewportScroll threshold={200} isLoading={user.isLoading} asyncHandler={getCharacter} style={style}>
         {user.data.map((char) => (
            <h3 key={char.id}>{char.name}</h3>
         ))}
         {user.isLoading && <div>Loading more characters...</div>}
      </ViewportScroll>
   );
}
```
