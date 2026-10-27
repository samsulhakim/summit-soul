import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { translate, translateFaq, translatePackage } from './translations';
import {
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiCompass,
  FiGlobe,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiMenu,
  FiPhone,
  FiShield,
  FiStar,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const fallbackHeroImage = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=88';
const fallbackAboutImage = 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1000&q=85';
const fallbackGallery = [
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85', alt: 'Hikers exploring an open mountain landscape' },
  { src: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=85', alt: 'Mountain range beneath a clear sky' },
  { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85', alt: 'Sunrise over a quiet mountain lake' },
  { src: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=85', alt: 'Mountain peaks in the morning light' },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85', alt: 'Alpine lake surrounded by mountains' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85', alt: 'Mountain peak under a starry sky' },
];

const imageUrl = (image) => {
  if (!image) return '';
  return /^(https?:)?\/\//i.test(image) || image.startsWith('/')
    ? image
    : `/storage/${image}`;
};

const FieldError = ({ children }) => (
  children ? <p className="mt-1 text-xs text-rose-300">{children}</p> : null
);

const MountainMark = ({ className }) => (
  <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M3 25 12 10l4.3 6.7 3.2-4.8L29 25H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="m9.2 15 2.8 2.1M19 18.5l1.5 1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export default function Home({
  theme = {},
  hero = {},
  sections = {},
  galleryMedia = [],
  packages = [],
  navigation = [],
  testimonials = [],
  faqs = [],
}) {
  const { flash, locale: currentLocale = 'en' } = usePage().props;
  const locale = currentLocale === 'id' ? 'id' : 'en';
  const t = (text) => translate(text, locale);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showAllPackages, setShowAllPackages] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const about = sections.about_guide?.content ?? {};
  const highlights = sections.highlights?.content?.items ?? [];
  const gallery = sections.gallery?.content ?? {};
  const experience = sections.experience?.content ?? {};
  const contact = theme.contact ?? {};
  const visiblePackages = Array.isArray(packages) ? packages : [];
  const visibleNavigation = Array.isArray(navigation) ? navigation : [];
  const visibleTestimonials = Array.isArray(testimonials) ? testimonials : [];
  const visibleFaqs = Array.isArray(faqs) ? faqs : [];
  const packagesToShow = showAllPackages ? visiblePackages : visiblePackages.slice(0, 4);
  const photos = Array.isArray(galleryMedia) && galleryMedia.length > 0
    ? galleryMedia
    : Array.isArray(gallery.images) && gallery.images.length > 0
      ? gallery.images
      : fallbackGallery;
  const activeTestimonial = visibleTestimonials.length > 0
    ? visibleTestimonials[testimonialIndex % visibleTestimonials.length]
    : null;

  const { data, setData, post, processing, reset, errors } = useForm({
    package_id: '',
    customer_name: '',
    email: '',
    phone_whatsapp: '',
    nationality: '',
    preferred_travel_date: '',
    travelers_count: 1,
    message: '',
  });

  const handleInquirySubmit = (event) => {
    event.preventDefault();
    post(route('public.inquiry.submit'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const handleSelectPackage = (packageId) => {
    setData('package_id', packageId);
    setSelectedPackage(null);
    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const logo = theme.brand?.brand_name || 'SUMMIT SOUL';
  const heroContent = hero.content ?? {};
  const heroImage = imageUrl(heroContent.background_image) || fallbackHeroImage;
  const contactNumber = (contact.whatsapp || '').replace(/[^\d]/g, '');
  const priceLabel = (pkg) => Number(pkg.price) > 0
    ? `${pkg.currency} ${Number(pkg.price).toLocaleString()}`
    : 'Let’s plan it';

  const defaultNavigation = [
    { label: 'Home', url: '#home' },
    { label: 'About', url: '#about' },
    { label: 'Packages', url: '#packages' },
    { label: 'Gallery', url: '#gallery' },
    { label: 'Testimonials', url: '#testimonials' },
    { label: 'FAQ', url: '#faq' },
    { label: 'Contact', url: '#contact', type: 'cta' },
  ];

  const navItems = visibleNavigation.length > 0 ? visibleNavigation : defaultNavigation;
  const switchLocale = () => {
    router.post(route('locale.update', { locale: locale === 'en' ? 'id' : 'en' }), {}, {
      preserveScroll: true,
      preserveState: false,
    });
  };

  const languageButton = (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={t(locale === 'en' ? 'Change language to Indonesian' : 'Change language to English')}
      className="inline-flex items-center gap-1 rounded-full border border-white/25 px-2.5 py-1.5 text-[9px] font-semibold tracking-wider text-white transition hover:border-[#d9b875] hover:text-[#e5c57d]"
    >
      <FiGlobe className="h-3 w-3" /> {locale === 'en' ? 'ID' : 'EN'}
    </button>
  );

  return (
    <div
      className="min-h-screen bg-[#f5f2e9] font-body text-[#19332c]"
      style={{
        backgroundColor: theme.colors?.secondary_color || '#f5f2e9',
        '--ss-heading-font': theme.typography?.heading_font ? `"${theme.typography.heading_font}"` : '"Cormorant Garamond"',
        '--ss-body-font': theme.typography?.body_font ? `"${theme.typography.body_font}"` : '"DM Sans"',
      }}
    >
      <Head>
        <title>{t(theme.seo?.meta_title || `${logo} — Private Mountain Expeditions`)}</title>
        <meta name="description" content={t(theme.seo?.meta_description || 'Thoughtfully planned hiking adventures and private mountain guiding in Indonesia.')} />
      </Head>

      <header id="home" style={{ backgroundColor: theme.colors?.primary_color || '#09231d' }} className="sticky top-0 z-40 border-b border-white/10 text-white shadow-lg shadow-black/10 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <a href="#home" className="flex min-w-0 items-center gap-2.5" aria-label={`${logo} ${t('home')}`}>
            <MountainMark className="h-8 w-8 shrink-0 text-[#d9b875]" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-sm font-semibold tracking-[0.12em] sm:text-base">{logo}</span>
              <span className="mt-1 text-[7px] uppercase tracking-[0.19em] text-white/60">{t('Luxury adventure experience')}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-5 xl:flex">
            {navItems.map((item) => (
              <a
                key={`${item.label}-${item.url}`}
                href={item.url}
                target={item.open_new_tab ? '_blank' : undefined}
                rel={item.open_new_tab ? 'noopener noreferrer' : undefined}
                className={`whitespace-nowrap text-[10px] font-medium transition hover:text-[#e6c781] ${
                  item.type === 'cta'
                    ? 'rounded-full bg-[#d9b875] px-4 py-2 text-[#173128] hover:bg-[#edcf8b] hover:text-[#173128]'
                    : 'text-white/85'
                }`}
              >
                {item.type === 'cta' ? t('Plan Your Adventure') : t(item.label)}
              </a>
            ))}
            {languageButton}
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white xl:hidden"
            aria-label={t(mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu')}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="xl:hidden">{languageButton}</div>
        </div>
        {mobileMenuOpen && (
          <nav className="grid gap-1 border-t border-white/10 bg-[#09231d] px-5 py-3 xl:hidden">
            {navItems.map((item) => (
              <a
                key={`${item.label}-${item.url}`}
                href={item.url}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded px-3 py-2.5 text-xs ${item.type === 'cta' ? 'bg-[#d9b875] font-semibold text-[#173128]' : 'text-white/85 hover:bg-white/5'}`}
              >
                {item.type === 'cta' ? t('Plan Your Adventure') : t(item.label)}
              </a>
            ))}
          </nav>
        )}
      </header>

      {hero.is_visible !== false && (
        <section
          className="relative flex min-h-[620px] items-center overflow-hidden bg-[#102720] text-white sm:min-h-[680px] lg:min-h-[660px]"
          style={{ backgroundImage: `url("${heroImage}")`, backgroundPosition: 'center 54%', backgroundSize: 'cover' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#081d18]/90 via-[#102720]/55 to-[#102720]/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09231d]/90 via-transparent to-[#09231d]/10" />
          <div className="relative mx-auto flex min-h-[620px] w-full max-w-[1440px] flex-col justify-center px-6 pb-32 pt-24 sm:min-h-[680px] sm:px-10 lg:min-h-[660px] lg:px-16">
            <div className="max-w-[620px]">
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#e2c47e] sm:text-[10px]">
                {t(heroContent.eyebrow || 'PRIVATE HIKING & MOUNTAIN EXPEDITIONS')}
              </p>
              <h1 className="font-display max-w-[600px] text-4xl leading-[1.05] text-[#fffdf7] sm:text-5xl lg:text-[62px]">
                {t(heroContent.headline || 'Discover the Mountains. Experience the Extraordinary.')}
              </h1>
              <p className="mt-5 max-w-[480px] text-sm leading-6 text-white/80 sm:text-[15px]">
                {t(heroContent.description || 'Explore Indonesia’s breathtaking landscapes with a dedicated local hiking guide. Thoughtfully planned adventures, meaningful connections, and unforgettable journeys.')}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={heroContent.primary_cta_url || '#packages'}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b875] px-5 py-3 text-[10px] font-semibold text-[#173128] transition hover:bg-[#edcf8b]"
                >
                  {t(heroContent.primary_cta_label || 'Explore Adventures')} <FiArrowRight />
                </a>
                <a
                  href={heroContent.secondary_cta_url || '#about'}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/55 bg-black/10 px-5 py-3 text-[10px] font-semibold text-white transition hover:bg-white/10"
                >
                  {t(heroContent.secondary_cta_label || 'Meet Your Guide')}
                </a>
              </div>
            </div>

            <div className="absolute inset-x-6 bottom-0 grid grid-cols-2 gap-3 border-t border-white/20 py-5 sm:inset-x-10 sm:grid-cols-4 lg:inset-x-16">
              {(highlights.length > 0 ? highlights : [
                { title: 'Local Expert Guide', description: 'Rooted in the landscapes we explore' },
                { title: 'Safe & Comfortable', description: 'Thoughtful planning at every step' },
                { title: 'Customizable Itineraries', description: 'Your pace, your preferences' },
                { title: 'Sustainable Travel', description: 'Support for local communities' },
              ]).slice(0, 4).map((item, index) => {
                const HighlightIcon = [FiCompass, FiShield, FiMapPin, FiUsers][index];
                return (
                  <div key={item.title} className="flex items-start gap-2.5 text-white/85">
                    <HighlightIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#dfc27e]" />
                    <span className="min-w-0">
                      <span className="block text-[9px] font-semibold leading-tight">{t(item.title)}</span>
                      <span className="mt-1 hidden text-[8px] leading-3 text-white/55 sm:block">{t(item.description)}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {sections.about_guide?.is_visible !== false && (
        <section id="about" className="bg-[#f5f2e9]">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[0.95fr_1.2fr_0.85fr] lg:items-center lg:gap-10 lg:px-12 lg:py-20">
            <img
              src={imageUrl(about.image) || fallbackAboutImage}
              alt={about.guide_name || contact.guide_name || t('Local mountain guide')}
              className="h-[300px] w-full rounded-sm object-cover sm:h-[390px] lg:h-[330px]"
              loading="lazy"
            />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#ad8850]">{t(about.eyebrow || 'ABOUT THE GUIDE')}</p>
              <h2 className="font-display mt-3 text-3xl leading-tight text-[#18342c] sm:text-4xl">
                {t(about.heading || 'More Than a Guide, A Local Friend.')}
              </h2>
              <p className="mt-4 max-w-xl text-xs leading-6 text-[#66716a]">
                {t(about.description || 'Get to know Indonesia beyond the trail. Enjoy thoughtful planning, personal attention, and a deep respect for the landscapes and communities you visit.')}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#d8d4c8] pt-5">
                {[
                  ['Local', 'Mountain knowledge'],
                  ['Small', 'Personal groups'],
                  ['Made for you', 'Custom routes'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-display text-xl leading-none text-[#19392f]">{t(value)}</p>
                    <p className="mt-1.5 text-[8px] text-[#727a72]">{t(label)}</p>
                  </div>
                ))}
              </div>
              <a href="#contact" className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold text-[#264b3e] underline decoration-[#c4a66e] underline-offset-4">
                {t('Learn More About Us')} <FiArrowRight />
              </a>
            </div>
            <div className="rounded-sm bg-[#ebe8de] p-5 sm:p-6">
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8d7653]">{t('Your experience, thoughtfully planned')}</p>
              <div className="space-y-4">
                {(about.credentials ?? [
                  'Safety-conscious expedition planning',
                  'Local knowledge in English and Bahasa Indonesia',
                  'Thoughtful pacing for every group',
                  'Respect for local culture and nature',
                ]).map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[10px] leading-4 text-[#58645e]">
                    <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#577565]" />
                    <span>{t(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="packages" style={{ backgroundColor: theme.colors?.primary_color || '#0b241e' }} className="text-white">
        <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d9b875]">{t('Featured packages')}</p>
              <h2 className="font-display mt-2 text-3xl text-[#fffdf7] sm:text-4xl">{t('Popular Hiking Packages')}</h2>
              <p className="mt-2 max-w-xl text-[11px] leading-5 text-white/60">{t('Choose from our most loved trekking experiences, or let’s create a custom journey that fits your dreams.')}</p>
            </div>
            <button type="button" onClick={() => {
              if (visiblePackages.length <= 4 && !showAllPackages) {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                return;
              }
              setShowAllPackages((show) => !show);
            }} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/35 px-4 py-2.5 text-[9px] font-medium text-white transition hover:border-[#d9b875] hover:text-[#e5c57d]">
              {showAllPackages ? t('Show Featured') : t('View All Packages')} <FiArrowRight />
            </button>
          </div>

          {visiblePackages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {packagesToShow.map((pkg) => {
                const localizedPackage = translatePackage(pkg, locale);

                return (
                <article key={pkg.id} className="group overflow-hidden rounded-sm bg-[#f5f2e9] text-[#18342c] shadow-xl shadow-black/10 transition hover:-translate-y-1">
                  <button type="button" onClick={() => setSelectedPackage(localizedPackage)} className="relative block h-40 w-full overflow-hidden text-left">
                    <img
                      src={imageUrl(pkg.featured_image) || photos[0]?.src}
                      alt={localizedPackage.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-[#09231d]/75 px-2.5 py-1 text-[8px] uppercase tracking-wider text-white">{localizedPackage.destination}</span>
                  </button>
                  <div className="flex min-h-[185px] flex-col p-4">
                    <h3 className="font-display text-lg font-semibold leading-tight">{localizedPackage.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[9px] leading-4 text-[#68746d]">{localizedPackage.short_description}</p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-[#64736a]">
                      <span className="inline-flex items-center gap-1"><FiCompass /> {localizedPackage.difficulty_level}</span>
                      <span className="inline-flex items-center gap-1"><FiUsers /> {localizedPackage.duration}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#dedbd1] pt-3">
                      <div>
                        <span className="block text-[7px] uppercase tracking-wider text-[#838a81]">{Number(pkg.price) > 0 ? t('Starting from') : t('Private journey')}</span>
                        <span className="font-display text-sm font-semibold text-[#294c3e]">{priceLabel(pkg)}</span>
                        {Number(pkg.price) > 0 && <span className="ml-1 text-[8px] text-[#838a81]">/ {locale === 'id' ? localizedPackage.price_unit : pkg.price_unit?.replace('_', ' ')}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectPackage(pkg.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#e6decb] px-2.5 py-2 text-[8px] font-semibold text-[#294c3e] transition hover:bg-[#d9b875]"
                      >
                        {t('Details')} <FiArrowRight />
                      </button>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded border border-white/15 p-7 text-center">
              <p className="font-display text-2xl">{t('Your next adventure starts here.')}</p>
              <p className="mt-2 text-xs text-white/60">{t('Contact us to plan a private hiking experience.')}</p>
              <a href="#contact" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#d9b875] px-4 py-2.5 text-[9px] font-semibold text-[#173128]">{t('Plan an Adventure')} <FiArrowRight /></a>
            </div>
          )}
        </div>
      </section>

      {sections.gallery?.is_visible !== false && (
        <section id="gallery" className="bg-[#f5f2e9]">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-12 lg:px-12 lg:py-20">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#ad8850]">{t(gallery.eyebrow || 'OUR GALLERY')}</p>
              <h2 className="font-display mt-2 text-3xl leading-tight text-[#18342c] sm:text-4xl">{t(gallery.heading || 'Small Adventures. Unforgettable Memories.')}</h2>
              <p className="mt-3 text-[11px] leading-5 text-[#6d766e]">{t(gallery.description || 'A glimpse of the landscapes, people, and moments that make every journey special.')}</p>
              <a href="#contact" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#87958b] px-4 py-2.5 text-[9px] font-semibold text-[#2c4b3e] transition hover:border-[#b18d54] hover:text-[#8c6b37]">
                {t('Plan Your Own Journey')} <FiArrowRight />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {photos.slice(0, 6).map((photo, index) => (
                <button
                  key={`${photo.src}-${index}`}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className={`group relative overflow-hidden rounded-sm bg-[#d9d4c7] ${index === 0 || index === 5 ? 'h-40 sm:h-48' : 'h-40 sm:h-48'}`}
                  aria-label={`${locale === 'id' ? 'Lihat foto' : 'View photo'}: ${t(photo.alt || 'mountain landscape')}`}
                >
                  <img
                    src={imageUrl(photo.src)}
                    alt={t(photo.alt || 'Mountain expedition')}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="testimonials" style={{ backgroundColor: theme.colors?.primary_color || '#0b241e' }} className="relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url("${photos[2]?.src || fallbackHeroImage}")`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
        <div className="relative mx-auto max-w-[900px] px-6 py-16 text-center sm:px-10 lg:py-20">
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d9b875]">{t('Stories from the trail')}</p>
          <div className="my-4 flex justify-center gap-1 text-[#e4c47d]">
            {Array.from({ length: activeTestimonial?.rating || 5 }).map((_, index) => <FiStar key={index} className="h-3.5 w-3.5 fill-current" />)}
          </div>
          <blockquote className="font-display mx-auto max-w-[730px] text-2xl leading-snug text-[#fffdf7] sm:text-3xl">
            “{activeTestimonial?.review_text || t('The summit is only part of the journey. We plan every detail around safety, connection, and the joy of being outdoors.') }”
          </blockquote>
          <p className="mt-5 text-[9px] uppercase tracking-[0.15em] text-white/65">
            {activeTestimonial
              ? `— ${activeTestimonial.customer_name}${activeTestimonial.country ? `, ${activeTestimonial.country}` : ''}`
              : t('The Summit Soul experience')}
          </p>
          {visibleTestimonials.length > 1 && (
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" aria-label={t('Previous testimonial')} onClick={() => setTestimonialIndex((index) => (index - 1 + visibleTestimonials.length) % visibleTestimonials.length)} className="rounded-full border border-white/25 p-2 text-white/80 hover:border-[#d9b875] hover:text-[#e4c47d]"><FiArrowRight className="rotate-180" /></button>
              <button type="button" aria-label={t('Next testimonial')} onClick={() => setTestimonialIndex((index) => (index + 1) % visibleTestimonials.length)} className="rounded-full border border-white/25 p-2 text-white/80 hover:border-[#d9b875] hover:text-[#e4c47d]"><FiArrowRight /></button>
            </div>
          )}
        </div>
      </section>

      <section id="faq" className="bg-[#f5f2e9]">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:px-12 lg:py-20">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#ad8850]">{t('Expedition guidelines')}</p>
            <h2 className="font-display mt-2 text-3xl leading-tight text-[#18342c] sm:text-4xl">{t('Frequently Asked Questions')}</h2>
            <p className="mt-3 text-[11px] leading-5 text-[#6d766e]">{t('Good journeys begin with good questions. If you need a hand, just get in touch.')}</p>
            <a href="#contact" className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold text-[#294c3e] underline decoration-[#c4a66e] underline-offset-4">{t('Ask us anything')} <FiArrowRight /></a>
          </div>
          <div className="space-y-2">
            {visibleFaqs.length > 0 ? visibleFaqs.map((faq, index) => {
              const localizedFaq = translateFaq(faq, locale);
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.id} className="border-b border-[#d8d4c8]">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base text-[#203c32]">{localizedFaq.question}</span>
                    <FiChevronDown className={`h-4 w-4 shrink-0 text-[#987742] transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <p className="max-w-2xl pb-4 text-[10px] leading-5 text-[#68746d]">{localizedFaq.answer}</p>}
                </div>
              );
            }) : (
              <p className="border-b border-[#d8d4c8] py-4 text-[11px] text-[#68746d]">{t('Contact our guide and we’ll be happy to help plan your trip.')}</p>
            )}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-[#0b241e] text-white"
        style={{ backgroundColor: theme.colors?.primary_color || '#0b241e', backgroundImage: `linear-gradient(90deg, rgba(7,28,22,.96), rgba(7,28,22,.77)), url("${photos[3]?.src || fallbackHeroImage}")`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12 lg:py-20">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d9b875]">{t('Start your next adventure')}</p>
            <h2 className="font-display mt-2 max-w-lg text-3xl leading-tight text-[#fffdf7] sm:text-4xl">{t('Get in Touch')}</h2>
            <p className="mt-3 max-w-md text-[11px] leading-5 text-white/70">{t('Tell us what you’re dreaming of. We’ll help you find the right route, pace, and experience.')}</p>
            <div className="mt-7 space-y-4">
              {contact.whatsapp && (
                <a href={`https://wa.me/${contactNumber}`} className="flex items-center gap-3 text-[10px] text-white/85 hover:text-[#e5c57d]">
                  <FiPhone className="h-4 w-4 text-[#d9b875]" />
                  <span><span className="block font-semibold">{t('WhatsApp')}</span><span className="mt-0.5 block text-white/60">{contact.whatsapp}</span></span>
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-[10px] text-white/85 hover:text-[#e5c57d]">
                  <FiMail className="h-4 w-4 text-[#d9b875]" />
                  <span><span className="block font-semibold">{t('Email')}</span><span className="mt-0.5 block text-white/60">{contact.email}</span></span>
                </a>
              )}
              {contact.location && (
                <div className="flex items-center gap-3 text-[10px] text-white/85">
                  <FiMapPin className="h-4 w-4 text-[#d9b875]" />
                  <span><span className="block font-semibold">{t('Location')}</span><span className="mt-0.5 block text-white/60">{contact.location}</span></span>
                </div>
              )}
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 pt-1 text-[9px] text-white/75 hover:text-[#e5c57d]">
                  <FiInstagram /> {t('Follow our journeys')}
                </a>
              )}
            </div>
          </div>

          <div id="inquiry" className="rounded-sm bg-[#f5f2e9] p-5 text-[#18342c] shadow-2xl sm:p-7">
            <h3 className="font-display text-2xl">{t('Send an Inquiry')}</h3>
            <p className="mt-1 text-[9px] text-[#727a72]">{t('Share a few details and we’ll be in touch.')}</p>
            {flash?.success && <div role="status" className="mt-4 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-[10px] text-emerald-800">{t(flash.success)}</div>}
            <form onSubmit={handleInquirySubmit} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-[9px] font-medium text-[#526258]">
                {t('Your Name *')}
                <input type="text" required value={data.customer_name} onChange={(event) => setData('customer_name', event.target.value)} className="mt-1.5 w-full rounded-sm border border-[#d8d4c8] bg-white px-3 py-2.5 text-[10px] text-[#203c32] outline-none focus:border-[#9b8150]" />
                <FieldError>{errors.customer_name}</FieldError>
              </label>
              <label className="text-[9px] font-medium text-[#526258]">
                {t('Email Address *')}
                <input type="email" required value={data.email} onChange={(event) => setData('email', event.target.value)} className="mt-1.5 w-full rounded-sm border border-[#d8d4c8] bg-white px-3 py-2.5 text-[10px] text-[#203c32] outline-none focus:border-[#9b8150]" />
                <FieldError>{errors.email}</FieldError>
              </label>
              <label className="text-[9px] font-medium text-[#526258]">
                {t('WhatsApp / Phone')}
                <input type="tel" value={data.phone_whatsapp} onChange={(event) => setData('phone_whatsapp', event.target.value)} className="mt-1.5 w-full rounded-sm border border-[#d8d4c8] bg-white px-3 py-2.5 text-[10px] text-[#203c32] outline-none focus:border-[#9b8150]" />
              </label>
              <label className="text-[9px] font-medium text-[#526258]">
                {t('Preferred Travel Date')}
                <input type="date" value={data.preferred_travel_date} onChange={(event) => setData('preferred_travel_date', event.target.value)} className="mt-1.5 w-full rounded-sm border border-[#d8d4c8] bg-white px-3 py-2.5 text-[10px] text-[#203c32] outline-none focus:border-[#9b8150]" />
                <FieldError>{errors.preferred_travel_date}</FieldError>
              </label>
              <label className="text-[9px] font-medium text-[#526258]">
                {t('Number of Travelers *')}
                <input type="number" min="1" max="50" required value={data.travelers_count} onChange={(event) => setData('travelers_count', event.target.value)} className="mt-1.5 w-full rounded-sm border border-[#d8d4c8] bg-white px-3 py-2.5 text-[10px] text-[#203c32] outline-none focus:border-[#9b8150]" />
                <FieldError>{errors.travelers_count}</FieldError>
              </label>
              <label className="text-[9px] font-medium text-[#526258]">
                {t('Choose an Adventure')}
                <select value={data.package_id} onChange={(event) => setData('package_id', event.target.value)} className="mt-1.5 w-full rounded-sm border border-[#d8d4c8] bg-white px-3 py-2.5 text-[10px] text-[#203c32] outline-none focus:border-[#9b8150]">
                  <option value="">{t('A custom private journey')}</option>
                  {visiblePackages.map((pkg) => <option key={pkg.id} value={pkg.id}>{translatePackage(pkg, locale).title}</option>)}
                </select>
                <FieldError>{errors.package_id}</FieldError>
              </label>
              <label className="text-[9px] font-medium text-[#526258] sm:col-span-2">
                {t('Tell Us About Your Trip *')}
                <textarea rows="3" required maxLength="3000" value={data.message} onChange={(event) => setData('message', event.target.value)} placeholder={t('Your experience, preferred pace, and what you hope to see...')} className="mt-1.5 w-full resize-y rounded-sm border border-[#d8d4c8] bg-white px-3 py-2.5 text-[10px] text-[#203c32] outline-none placeholder:text-[#a0a49c] focus:border-[#9b8150]" />
                <FieldError>{errors.message}</FieldError>
              </label>
              <button type="submit" disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#d9b875] px-4 py-3 text-[9px] font-semibold text-[#173128] transition hover:bg-[#edcf8b] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2">
                {processing ? `${t('Sending')}…` : t('Send Message')} <FiArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>

      {sections.experience?.is_visible !== false && (
        <section className="bg-[#eeeade]">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9b8150]">{t(experience.eyebrow || 'WHY TRAVEL WITH US')}</p>
              <h2 className="font-display mt-1 text-2xl text-[#18342c]">{t(experience.heading || 'More Than Just a Hike, It’s a Life Experience.')}</h2>
              <p className="mt-1 text-[9px] text-[#747c73]">{t(experience.description || 'A thoughtful journey from the first conversation to the final trail.')}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
              {(experience.benefits ?? ['Expert Guidance & Safety', 'Authentic Local Experiences', 'Small Groups & Personal Service', 'Sustainable Travel']).map((benefit, index) => {
                const BenefitIcon = [FiShield, FiGlobe, FiUsers, FiCompass][index % 4];
                return <div key={benefit} className="flex items-center gap-2 text-[8px] leading-4 text-[#4c5c52]"><BenefitIcon className="h-4 w-4 shrink-0 text-[#597968]" />{t(benefit)}</div>;
              })}
            </div>
          </div>
        </section>
      )}

      <footer style={{ backgroundColor: theme.colors?.primary_color || '#081e19' }} className="text-white/60">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-6 py-7 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12">
          <a href="#home" className="flex items-center gap-2 text-white">
            <MountainMark className="h-6 w-6 text-[#d9b875]" />
            <span className="font-display text-sm tracking-[0.12em]">{logo}</span>
          </a>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[8px]">
            {navItems.map((item) => <a key={`${item.label}-footer`} href={item.url} className="transition hover:text-[#e5c57d]">{t(item.label)}</a>)}
          </nav>
          <div className="text-[8px] md:text-right">
            <p>{t('Explore. Respect. Preserve.')}</p>
            <p className="mt-1">© {new Date().getFullYear()} {logo}. {t('All rights reserved.')}</p>
          </div>
        </div>
      </footer>

      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-labelledby="package-dialog-title" onClick={() => setSelectedPackage(null)}>
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-sm bg-[#f5f2e9] text-[#18342c] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-52">
              <img src={imageUrl(selectedPackage.featured_image) || photos[0]?.src} alt={selectedPackage.title} className="h-full w-full object-cover" />
              <button type="button" aria-label={t('Close package details')} onClick={() => setSelectedPackage(null)} className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"><FiX /></button>
            </div>
            <div className="p-6">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#987742]">{selectedPackage.destination} · {selectedPackage.duration}</p>
              <h2 id="package-dialog-title" className="font-display mt-2 text-3xl">{selectedPackage.title}</h2>
              <p className="mt-3 text-xs leading-6 text-[#68746d]">{selectedPackage.short_description}</p>
              {selectedPackage.full_description && <div className="prose prose-sm mt-4 max-w-none text-[#526258]" dangerouslySetInnerHTML={{ __html: selectedPackage.full_description }} />}
              {Array.isArray(selectedPackage.included_services) && selectedPackage.included_services.length > 0 && (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {selectedPackage.included_services.map((service) => <li key={service} className="flex items-center gap-2 text-[10px] text-[#526258]"><FiCheck className="text-[#597968]" />{service}</li>)}
                </ul>
              )}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#d8d4c8] pt-4">
                <span className="font-display text-lg font-semibold">{priceLabel(selectedPackage)}</span>
                <button type="button" onClick={() => handleSelectPackage(selectedPackage.id)} className="inline-flex items-center gap-2 rounded-full bg-[#d9b875] px-4 py-2.5 text-[9px] font-semibold text-[#173128] hover:bg-[#edcf8b]">{t('Ask About This Trip')} <FiArrowRight /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label={t(selectedPhoto.alt || 'Gallery image')} onClick={() => setSelectedPhoto(null)}>
          <button type="button" aria-label={t('Close gallery image')} onClick={() => setSelectedPhoto(null)} className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><FiX /></button>
          <img src={imageUrl(selectedPhoto.src)} alt={t(selectedPhoto.alt || 'Mountain expedition')} className="max-h-[85vh] max-w-full object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
