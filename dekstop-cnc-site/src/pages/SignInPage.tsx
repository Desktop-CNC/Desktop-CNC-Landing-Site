import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Container, Button, Form, Card } from 'react-bootstrap'; // Using your Bootstrap layout

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
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <Card className="p-4 shadow-sm">
                <h3 className="mb-3">Sign In</h3>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
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
