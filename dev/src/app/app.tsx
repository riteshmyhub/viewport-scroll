import ViewportScroll, { type ScrollHandlerType } from "viewport-scroll";
import { useState } from "react";
import { type CSSProperties } from "react";

type Character = {
   id: number;
   name: string;
   image: string;
   species: string;
   status: string;
};

export default function PaginatedList() {
   const [user, setUser] = useState<{
      isLoading: boolean;
      data: Character[];
   }>({
      isLoading: false,
      data: [],
   });

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

   const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
         case "alive":
            return "#55cc44";
         case "dead":
            return "#ff5555";
         default:
            return "#ffaa00";
      }
   };

   return (
      <ViewportScroll threshold={200} isLoading={user.isLoading} asyncHandler={getCharacter} style={styles.scrollContainer}>
         <div style={styles.grid}>
            {user.data.map((char) => (
               <div
                  key={`char-${char.id}`}
                  style={styles.card}
                  //@ts-ignore
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = styles.cardHover.boxShadow)}
                  //@ts-ignore
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = styles.card.boxShadow)}>
                  <div style={styles.imageContainer}>
                     <img src={char.image} alt={char.name} style={styles.image} />
                     <div
                        style={{
                           ...styles.statusBadge,
                           backgroundColor: getStatusColor(char.status),
                        }}>
                        {char.status}
                     </div>
                  </div>
                  <div style={styles.info}>
                     <h3 style={styles.name}>{char.name}</h3>
                     <div style={styles.species}>{char.species}</div>
                     <div style={styles.id}>ID: #{char.id}</div>
                  </div>
               </div>
            ))}
         </div>

         {user.isLoading && (
            <div style={styles.loadingContainer}>
               <div style={styles.loadingSpinner}></div>
               <div style={styles.loadingText}>Loading more characters...</div>
            </div>
         )}
      </ViewportScroll>
   );
}

const styles: Record<string, CSSProperties> = {
   title: {
      margin: 0,
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "1px",
   },
   subtitle: {
      margin: "0.5rem 0 0",
      fontSize: "1.1rem",
      opacity: 0.9,
      fontWeight: 300,
   },
   content: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem 1rem",
   },
   scrollContainer: {
      height: "97vh",
      width: "80%",
      overflowY: "auto",
      margin: "auto",
   },
   grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: "1.5rem",
      padding: "0.5rem",
   },
   card: {
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: "column",
   },
   cardHover: {
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
   },
   imageContainer: {
      position: "relative",
      width: "100%",
      paddingTop: "100%", // Square aspect ratio
      overflow: "hidden",
   },
   image: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
   },
   statusBadge: {
      position: "absolute",
      top: "10px",
      right: "10px",
      color: "white",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      textTransform: "capitalize",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
   },
   info: {
      padding: "1.2rem",
      flex: 1,
      display: "flex",
      flexDirection: "column",
   },
   name: {
      margin: "0 0 0.5rem",
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#333",
   },
   species: {
      fontSize: "0.9rem",
      color: "#666",
      marginBottom: "0.8rem",
   },
   id: {
      fontSize: "0.8rem",
      color: "#999",
      marginTop: "auto",
   },
   loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      gridColumn: "1 / -1",
   },
   loadingSpinner: {
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #42b4ca",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "1rem",
   },
   loadingText: {
      color: "#666",
      fontSize: "0.9rem",
   },
};
