import { useState } from 'react';
import { supabase } from '../utils/supabase.js';
import { Container, Button, Form, Card } from 'react-bootstrap'; 

function SignInPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // handle SSO 
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        
        if (error) alert(error.message);
        else alert('SSO verification was sent to email.');
        setLoading(false);
    };

    return (
        <Container className="mt-5" style={{ width: '100%', height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card className="p-4 shadow-sm" style={{ width: "25%", height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'  }}>
                <img src="public/assets/account_icon.png" style={{opacity: 0.65, width: "8rem", margin: "1rem"}} alt="Account Icon"/>
                <h3 className="mb-3">Sign In Below</h3>
                <p>Sign in or register here.</p>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Email address</strong></Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="name@wpi.edu" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Sending...' : 'Sign In'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}

export default SignInPage;
