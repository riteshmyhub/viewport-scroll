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
            style={{ height: "400px", width: "80%", overflowY: "auto", margin: "auto", border: "1px solid #ccc", padding: "1rem" }}>
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
