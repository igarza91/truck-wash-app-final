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
    // Simulate login validation
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "login", username: user, password })
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
  };

  const handleFinalize = async () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US");
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

    const payload = {
      action: "log",
      date,
      time,
      typeA: truckCounts.typeA,
      typeB: truckCounts.typeB,
      typeC: truckCounts.typeC,
      user
    };

    await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(payload)
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
        <div className="flex justify-between items-center">
          <span>Type A</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setTruckCounts({ ...truckCounts, typeA: Math.max(0, truckCounts.typeA - 1) })}>−</button>
            <span>{truckCounts.typeA}</span>
            <button onClick={() => setTruckCounts({ ...truckCounts, typeA: truckCounts.typeA + 1 })}>+</button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span>Type B</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setTruckCounts({ ...truckCounts, typeB: Math.max(0, truckCounts.typeB - 1) })}>−</button>
            <span>{truckCounts.typeB}</span>
            <button onClick={() => setTruckCounts({ ...truckCounts, typeB: truckCounts.typeB + 1 })}>+</button>
          </div>
        </div>

        {typeCEnabled && (
          <div className="flex justify-between items-center">
            <span>Type C</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setTruckCounts({ ...truckCounts, typeC: Math.max(0, truckCounts.typeC - 1) })}>−</button>
              <span>{truckCounts.typeC}</span>
              <button onClick={() => setTruckCounts({ ...truckCounts, typeC: truckCounts.typeC + 1 })}>+</button>
            </div>
          </div>
        )}
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
