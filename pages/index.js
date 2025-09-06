import { useState } from "react";

export default function Home() {
  const [tournamentText, setTournamentText] = useState("");
  const [rounds, setRounds] = useState([]);
  const [simulatedRating, setSimulatedRating] = useState(null);

  // Parse the pasted tournament data
  const parseTournaments = () => {
    const lines = tournamentText.split("\n").filter(Boolean);
    const parsedRounds = lines.map((line) => {
      // Split by tab or multiple spaces
      const parts = line.split(/\t| {2,}/);
      if (parts.length < 6) return null; // skip invalid lines

      return {
        event: parts[0],
        division: parts[3],
        date: parts[2],
        rating: parseInt(parts[5]),
        score: parseInt(parts[4]),
        pdgaApproved: parts[6] === "Yes",
        counted: parts[7] === "Yes",
      };
    }).filter(Boolean);

    setRounds(parsedRounds);
    setSimulatedRating(null); // reset previous simulation
  };

  // Add a new empty round manually
  const addRound = () => {
    setRounds([...rounds, { event: "", division: "", date: "", rating: 0, score: 0, pdgaApproved: true, counted: true }]);
  };

  // Update a round value
  const updateRound = (index, key, value) => {
    const newRounds = [...rounds];
    if (key === "rating" || key === "score") {
      newRounds[index][key] = parseInt(value) || 0;
    } else if (key === "pdgaApproved" || key === "counted") {
      newRounds[index][key] = value;
    } else {
      newRounds[index][key] = value;
    }
    setRounds(newRounds);
  };

  // Simple simulated rating calculation: average of all ratings
  const simulateRating = () => {
    if (rounds.length === 0) return;
    const total = rounds.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round(total / rounds.length);
    setSimulatedRating(avg);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>PDGA Rating Simulator</h1>

      <p>Paste your tournament rounds below (tab-separated, like exported from PDGA):</p>
      <textarea
        value={tournamentText}
        onChange={(e) => setTournamentText(e.target.value)}
        rows={8}
        style={{ width: "100%", padding: "0.5rem", fontFamily: "monospace" }}
        placeholder="Event Name  C  21-Jun-2025  MA1  66  934  Yes  Yes"
      />
      <button onClick={parseTournaments} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        Parse Rounds
      </button>

      {rounds.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Rounds</h2>
          {rounds.map((round, i) => (
            <div key={i} style={{ borderBottom: "1px solid #ccc", padding: "0.5rem 0" }}>
              <input
                type="text"
                value={round.event}
                onChange={(e) => updateRound(i, "event", e.target.value)}
                style={{ width: "200px", marginRight: "0.5rem" }}
              />
              <input
                type="date"
                value={round.date}
                onChange={(e) => updateRound(i, "date", e.target.value)}
                style={{ marginRight: "0.5rem" }}
              />
              <input
                type="number"
                value={round.score}
                onChange={(e) => updateRound(i, "score", e.target.value)}
                style={{ width: "60px", marginRight: "0.5rem" }}
              />
              <input
                type="number"
                value={round.rating}
                onChange={(e) => updateRound(i, "rating", e.target.value)}
                style={{ width: "60px", marginRight: "0.5rem" }}
              />
              <label>
                Evaluated
                <input
                  type="checkbox"
                  checked={round.pdgaApproved}
                  onChange={(e) => updateRound(i, "pdgaApproved", e.target.checked)}
                  style={{ marginLeft: "0.25rem" }}
                />
              </label>
              <label style={{ marginLeft: "1rem" }}>
                Included
                <input
                  type="checkbox"
                  checked={round.counted}
                  onChange={(e) => updateRound(i, "counted", e.target.checked)}
                  style={{ marginLeft: "0.25rem" }}
                />
              </label>
            </div>
          ))}

          <button onClick={addRound} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
            + Add Round
          </button>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={simulateRating} style={{ padding: "0.5rem 1rem", background: "purple", color: "white" }}>
              Simulate Rating
            </button>
          </div>

          {simulatedRating && (
            <div style={{ marginTop: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>
              Simulated Rating: {simulatedRating}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
