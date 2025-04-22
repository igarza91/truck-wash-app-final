import { useState } from "react";

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzUbngknTlb9II9lHzuooKBNtV5nvqKw69cCbsUxt8v1f-qLzxKtFis7760JFy5eGQlXw/exec";

export default function TruckWashApp() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [canViewPricing, setCanViewPricing] = useState(false);
  const [truckCounts, setTruckCounts] = useState({ typeA: 0, typeB: 0, typeC: 0 });
  const [typeCEnabled, setTypeCEnabled] = useState(true);
  const [logSubmitted, setLogSubmitted] = useState(false);

  const handleLogin = async () => {
    try {
      const form = new FormData();
      form.append("action", "login");
      form.append("username", user);
      form.append("password", password);

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: form
      });

      const data = await res.json();
      if (data.success) {
        setRole(data.role);
        setCanViewPricing(data.canViewPricing === "Yes");
        setTypeCEnabled(data.typeCEnabled === "Yes");
        setLoggedIn(true);
      } else {
        alert("Invalid login");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleFinalize = async () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US");
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    const total = truckCounts.typeA * 25 + truckCounts.typeB * 50 + truckCounts.typeC * 0;

    const form = new FormData();
    form.append("action", "log");
    form.append("date", date);
    form.append("time", time);
    form.append("typeA", truckCounts.typeA);
    form.append("typeB", truckCounts.typeB);
    form.append("typeC", truckCounts.typeC);
    form.append("total", total);
    form.append("user", user);

    await fetch(WEB_APP_URL, {
      method: "POST",
      body: form
    });

    setLogSubmitted(true);
  };

  if (!loggedIn) {
    return (
      <div className="p-4 max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        <input
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white rounded px-4 py-2 w-full"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (logSubmitted) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold">Log Submitted!</h1>
        <button
          onClick={() => {
            setLogSubmitted(false);
            setTruckCounts({ typeA: 0, typeB: 0, typeC: 0 });
          }}
          className="mt-4 bg-blue-600 text-white rounded px-4 py-2"
        >
          New Entry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Truck Wash Log</h1>
        <button onClick={() => setLoggedIn(false)} className="text-sm text-red-600 underline">Sign Out</button>
      </div>

      <div className="space-y-2">
        {["A", "B", "C"].map(type => {
          if (type === "C" && !typeCEnabled) return null;
          const label = `Type ${type}`;
          return (
            <div className="flex justify-between items-center" key={type}>
              <span>{label}</span>
              <div className="flex items-center gap-2">
                <button onClick={() =>
                  setTruckCounts({ ...truckCounts, [`type${type}`]: Math.max(0, truckCounts[`type${type}`] - 1) })
                }>−</button>
                <span>{truckCounts[`type${type}`]}</span>
                <button onClick={() =>
                  setTruckCounts({ ...truckCounts, [`type${type}`]: truckCounts[`type${type}`] + 1 })
                }>+</button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleFinalize}
        className="w-full mt-4 bg-green-600 text-white rounded px-4 py-2"
      >
        Finalize Day
      </button>

      {canViewPricing && (
        <div className="text-sm text-gray-600 mt-4">
          <p><strong>Pricing:</strong></p>
          <p>Type A = $25</p>
          <p>Type B = $50</p>
          <p>Type C = $0</p>
        </div>
      )}
    </div>
  );
}
