import { useEffect, useState } from "react";
import { supabase } from '../utils/supabase.js';

function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const approveLogin = async () => {
      try {
        // get request id from URL
        const requestId = new URLSearchParams(window.location.search).get("request");
        if (!requestId) {
          setStatus("error");
          return;
        }

        // get currently auth user (from email link click)
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setStatus("error");
          return;
        }

        const user = userData.user;
        // mark login request as approved
        const { error: updateError } = await supabase
          .from("login_requests")
          .update({ approved: true })
          .eq("id", requestId);
        if (updateError) {
          setStatus("error");
          return;
        }

        await supabase
          .from("users")
          .update({ auth_id: user.id })
          .eq("email", user.email);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    approveLogin();
  }, []);

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      {status === "loading" && (
        <>
          <h2>Approving login...</h2>
          <p>Please wait.</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2>Login Approved ✔</h2>
          <p>You can return to the original device.</p>
        </>
      )}

      {status === "error" && (
        <>
          <h2>Something went wrong</h2>
          <p>Invalid or expired request.</p>
        </>
      )}
    </div>
  );
}

export default VerifyPage;