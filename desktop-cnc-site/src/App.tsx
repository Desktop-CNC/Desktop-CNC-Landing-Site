
import { BrowserRouter, Routes, Route, type Session } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase.js';

import AccountNavBar from './components/AccountNavBar.js';
import { Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage.js'
import SignInPage from './pages/SignInPage.js';
import MyGcodePage from './pages/MyGcodePage.js';

type UserSession = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];

function App() {
    const [session, setSession] = useState<UserSession>(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession as UserSession);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession as UserSession);
      });

      return () => subscription.unsubscribe();
     }, []);

    return (
      <div style={{display: "flex", flexDirection: "column", minHeight: "100dvh"}}>
        <BrowserRouter>
          <AccountNavBar session={session} setSession={setSession}/>
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<HomePage/>}/>
              <Route path="/signin" element={<SignInPage/>}/>
              <Route path="/my-gcode" element={<MyGcodePage/>}/>
            </Routes>
          </main>
        </BrowserRouter>
        
        <footer style={{marginBottom: "auto", height:"max-content"}}>
            <div className="container text-center" style={{height:"100%"}}>
                <h3>2026 Desktop CNC | MME Teaching LAB | WPI</h3>
            </div>
        </footer>
      </div>
    )
}

export default App