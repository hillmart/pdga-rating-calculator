import { useState } from "react";

export default function Home() {
    const [pdgaNumber, setPdgaNumber] = useState("");
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPlayerData = async () => {
        if (!pdgaNumber) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`https://api.pdga.com/services/json/players?pdga_number=${pdgaNumber}`);
                  if (!res.ok) throw new Error("Player not found");
            const data = await res.json();
            setPlayerData(data);
            } catch (err) {
            setError(err.message);
            setPlayerData(null);
            } finally {
            setLoading(false);
            }
        };
      return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>PDGA Player Lookup</h1>

      {/* Input for PDGA Number */}
      <input
        type="text"
        placeholder="Enter PDGA #"
        value={pdgaNumber}
        onChange={(e) => setPdgaNumber(e.target.value)}
        style={{ padding: "0.5rem", width: "200px", marginRight: "1rem" }}
      />
      <button onClick={fetchPlayerData} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Loading..." : "Fetch Player Data"}
      </button>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Player Data */}
      {playerData && (
        <div style={{ marginTop: "2rem", border: "1px solid #ccc", padding: "1rem" }}>
          <h2>{playerData.name}</h2>
          <p>
            Current Rating: <strong>{playerData.rating}</strong>
          </p>
          <p>
            PDGA Number: <strong>{playerData.number}</strong>
          </p>
          <p>
            Class: <strong>{playerData.player_class}</strong>
          </p>
          {/* Add more stats here as needed */}
        </div>
      )}
    </div>
  );
}






// export default function Home() {
//   return (
//     <div style={{ padding: "2rem", textAlign: "center" }}>
//       <h1>Hello World</h1>
//       <p>This is a minimal Next.js app deployed on Vercel!</p>
//     </div>
//   );
// }
