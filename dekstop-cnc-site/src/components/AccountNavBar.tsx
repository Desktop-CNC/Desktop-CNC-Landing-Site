import { useState } from "react";
import NavBar from "./NavBar.js";
import { supabase } from '../utils/supabase.js';

interface Props {
    session: UserSession;
    setSession: any;
}

type UserSession = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];

function AccountNavBar({ session, setSession}: Props) {

    return (
        <NavBar 
          session={ session }
          setSession={ setSession }
          brandFront='Desktop CNC' 
          brandBack='@ MME-WPI' 
          items={[
            'Home', 
            'Getting Started',
            'My Gcode',
            'About CNC',
            'User Guides'
          ]}
          itemHrefs={[
            '/', 
            '/#getting-started',
            '/my-gcode',
            '#user-guides',
            
          ]}
          itemDropdowns={[3, 4]}
          dropdownContent={[
            [
              'Automatic Tool Changer',
              'Coolant',
              'Fourth Axis'
            ]
            ,[
              'CAM for CNC Milling', 
              'Uploading GCode Files',
              'Milling with UGS'
            ],
          ]}
          dropdownHrefs={[
            [
              '/',
              '/',
              '/'
            ],
            [
              '/',
              '/',
              '/'
            ]
          ]}
        />
    )
}

export default AccountNavBar;