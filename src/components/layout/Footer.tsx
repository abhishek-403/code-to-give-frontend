import { Button } from '@/components/ui/button';
import useLanguage from '@/lib/hooks/useLang';

const Footer = () => {
    const { t } = useLanguage()

    return (
        <footer className="bg-background border-t p-4 text-center">
            <div className="space-x-4">
                <Button variant="link" asChild><a href="/contact">{t("contact_us")}</a></Button>
                <Button variant="link" asChild><a href="http://www.samarthanam.org/" target="_blank" rel="noopener noreferrer">{t("samarthanam_official")}</a></Button>
            </div>
            <p className="mt-2 text-sm">
                {t("©️")} {new Date().getFullYear()} {t("samarthanam_|_all_rights_reserved.")}
            </p>
        </footer>
    );
};

export default Footer;