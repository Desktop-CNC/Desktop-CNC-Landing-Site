
import { BrowserRouter, Routes, Route, type Session } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';

import AccountNavBar from './components/AccountNavBar';

import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage';

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
      <BrowserRouter>
        <AccountNavBar session={session} setSession={setSession}/>
        <div>
          {session ? <p>Logged in as: {session.user.email}</p> : <p>Not logged in</p>}
        </div>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/signin" element={<SignInPage/>}/>
        </Routes>
      </BrowserRouter>
    )
}

export default App