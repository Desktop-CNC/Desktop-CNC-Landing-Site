import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase.js';
import { Container, Button, Form, Card } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"email" | "code">("email");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    // send OTP email
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            }
        });

        if (error) {
            alert(error.message);
        } else {
            setStep("code"); // switch UI to code input
        }

        setLoading(false);
    };

    // verify OTP code
    const handleVerify = async () => {
        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: "magiclink", // Changed to "magiclink" to support the 8-digit PKCE token
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        window.location.href = "/";
    };

    // check session
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };

        checkSession();
    }, []);

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <Container
            className="mt-5"
            style={{
                width: '100%',
                height: '60%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Card
                className="p-4 shadow-sm"
                style={{
                    width: "20rem",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <img
                    src="/assets/account_icon.png"
                    style={{ opacity: 0.65, width: "8rem", margin: "1rem" }}
                    alt="Account Icon"
                />

                <h3 className="mb-3">Sign In Below</h3>

                <p>Sign in or register here.</p>

                {step === "email" ? (
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Email address</strong></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Code'}
                        </Button>

                        <p
                            className="mb-3"
                            style={{
                                marginTop: "1rem",
                                color: "rgb(25,25,25)"
                            }}
                        >
                            Disclaimer: May not work with professional/school emails!
                        </p>
                    </Form>
                ) : (
                    <div style={{ width: "100%" }}>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Enter Code</strong></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="8-digit code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            className="w-100"
                            onClick={handleVerify}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </Button>
                        
                        <Button 
                            variant="link" 
                            className="w-100 mt-2" 
                            onClick={() => setStep("email")}
                            style={{ fontSize: '0.8rem', color: '#6c757d' }}
                        >
                            Back to Email
                        </Button>
                    </div>
                )}
            </Card>
        </Container>
    );
}

export default SignInPage;
