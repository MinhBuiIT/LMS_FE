import initTranslations from '@/src/configs/i18next';
import TranslationProvider from './TranslationProvider';

const i18nNamespaces = ['translation'];

export default async function Layout({ children, params }: any) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationProvider locale={locale} resources={resources} namespaces={i18nNamespaces}>
      {children}
    </TranslationProvider>
  );
}
