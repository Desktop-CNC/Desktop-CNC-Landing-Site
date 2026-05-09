import { useState } from "react";
import { supabase } from "../utils/supabase.js";

export default function EnterCode() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  const handleVerify = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      alert("Invalid code");
      return;
    }

    // success -> user is now logged in on this device
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h2>Enter Code</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="6-digit code"
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleVerify}>
        Verify
      </button>
    </div>
  );
}