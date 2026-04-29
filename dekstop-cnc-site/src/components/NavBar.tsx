import 'bootstrap/dist/css/bootstrap.css'
import './../App.css'
import { supabase } from '../utils/supabase';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate, Link, isSession} from 'react-router-dom';
import { Button } from 'react-bootstrap';

interface Props {
    items: string[];
    itemHrefs: string[];
    itemDropdowns: number[];
    dropdownContent: string[][];
    dropdownHrefs: string[][];
    brandFront: string;
    brandBack: string;
    session: UserSession;
    setSession: (session: UserSession | null) => void;
}

type UserSession = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];

/**
 * @brief Main navbar format / styles
 */
function NavBar({ items, itemHrefs, itemDropdowns, dropdownContent, dropdownHrefs, brandFront, brandBack, session, setSession}: Props) {
    const navigate = useNavigate()
    let dropdownIndex: number = 0

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signOut()

        if (error) {
          alert("Error signing out: " + error.message);
        } else {
          // clear the local state and go home
          setSession(null)
          navigate('/')
        }
    };

    return (
        <>
            <Navbar expand="lg" 
                    style={{ 
                        background: 'linear-gradient(90deg, #34495e 0%, #1a252f 100%)',
                        borderBottom: '1px solid rgba(0,0,0,0.1)' 
                    }}
                    className="py-2 shadow-lg"
                    data-bs-theme="dark">

                <Container fluid className="px-4">
                    {/*Show nav title*/}
                    <Navbar.Brand as={Link} to="/"
                        className="
                            fw-bold
                            text-white
                            ms-3
                            fs-4"
                    >
                        {brandFront}
                        <span className="
                            fw-light 
                            opacity-75
                            margin
                            ms-3
                            fs-4
                        ">
                            {brandBack}
                        </span>
                    </Navbar.Brand>
                    
                    {/* List all items as nav items */}
                    <Nav className="flex-row gap-3">
                        {items.map((item, index) => {
                            const isDropdown = itemDropdowns.includes(index)
            
                            if(isDropdown) {
                                dropdownIndex += 1
                                return (
                                    <>
                                        <NavDropdown 
                                            title={item} 
                                            id={`dropdown-${index}`}
                                            key={item}
                                            className="fw-semibold"
                                            renderMenuOnMount={true}
                                        >
                                            {dropdownContent[dropdownIndex-1].map((link, link_index) => (
                                                <NavDropdown.Item 
                                                    key={link}
                                                    as={Link}
                                                    to={`/${dropdownHrefs[dropdownIndex-1][link_index]}`}
                                                    className="dropdown-block-item"
                                                >
                                                    {link}
                                                </NavDropdown.Item>
                                            ))}
                                        </NavDropdown>
                                        <div 
                                            className="vr d-none d-lg-block align-self-center opacity-25" 
                                            style={{ height: '2rem', backgroundColor: 'white', width: '1px' }}
                                        />
                                    </>
                                )
                            }
                            return (
                                <>
                                    <Nav.Link 
                                        key={item}
                                        href={itemHrefs[index]}
                                        className="
                                            fw-semibold 
                                            px-3"
                                    >
                                        {item}
                                    </Nav.Link>
                                    <div 
                                        className="vr d-none d-lg-block align-self-center opacity-25" 
                                        style={{ height: '2rem', backgroundColor: 'white', width: '1px' }}
                                    />
                                </>
                            )
                        })}

                        {session ? (
                            <Nav.Link 
                                key="nav-sign-out"
                                as="button"
                                onClick={handleLogout}
                                className="
                                    fw-semibold 
                                    px-3"
                            >
                                Sign Out
                            </Nav.Link>
                        ): (
                            <Nav.Link 
                                key="nav-sign-in"
                                href='/signin'
                                className="
                                    fw-semibold 
                                    px-3"
                            >
                                Sign In
                            </Nav.Link>
                        )}
                        <div className='ms-5'/>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;

function useState(Number: NumberConstructor): [any, any] {
    throw new Error('Function not implemented.');
}
