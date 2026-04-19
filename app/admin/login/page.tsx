"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdminPage() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur");
        setLoading(false);
        return;
      }

      // ✅ succès → redirection admin
     router.push("/admin/commandes");
    } catch (err) {
      setError("Erreur serveur");
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Admin Login</h1>

        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

// --- styles simples propres ---
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center" as const,
  },
};