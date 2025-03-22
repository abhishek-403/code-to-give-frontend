import { Button } from '@/components/ui/button';

const Footer = () => {
    return (
        <footer className="bg-background border-t p-4 text-center">
            <div className="space-x-4">
                <Button variant="link" asChild><a href="/contact">Contact Us</a></Button>
                <Button variant="link" asChild><a href="http://www.samarthanam.org/" target="_blank" rel="noopener noreferrer">Samarthanam Official</a></Button>
            </div>
            <p className="mt-2 text-sm">© {new Date().getFullYear()} Samarthanam. All rights reserved.</p>
        </footer>
    );
};

export default Footer;