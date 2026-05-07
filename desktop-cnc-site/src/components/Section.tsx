import 'bootstrap/dist/css/bootstrap.css'
import './../App.css'
import { Container } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface Props {
    title: string;
    children: ReactNode; 
    variant?: 'main' | 'alt';
}

function Section({ title, children, variant = 'main' }: Props) {
    const sectionClass = variant === 'alt' ? 'section-alt' : 'section-main';
    const anchorId = title.toLowerCase().replace(/\s+/g, '-') + '-title';

    return (
        <section aria-labelledby={anchorId} className={sectionClass}
            style={{ 
                minHeight: '50dvh'
            }}>
            <Container className="content-container">
                <h2 id={anchorId} className="title-goldman">
                    {title}
                </h2>
                <div className="section-body">
                    {children}
                </div>
            </Container>
        </section>
    );
}
export default Section;