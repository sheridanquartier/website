import Image from 'next/image'
import Link from 'next/link'

interface HighlightItem {
  label: string
  text: string
}

interface FactItem {
  label: string
  value: string
}

interface GalleryItem {
  src: string
  alt: string
}

interface ProjectShowcasePageProps {
  eyebrow: string
  title: string
  subtitle: string
  heroImage: {
    src: string
    alt: string
  }
  address: string
  intro: string[]
  highlights: HighlightItem[]
  facts: FactItem[]
  website: {
    href: string
    label: string
  }
  cta?: {
    title: string
    text: string
    href: string
    label: string
  }
  gallery: GalleryItem[]
}

export default function ProjectShowcasePage({
  eyebrow,
  title,
  subtitle,
  heroImage,
  address,
  intro,
  highlights,
  facts,
  website,
  cta,
  gallery,
}: ProjectShowcasePageProps) {
  return (
    <>
      <div className="app-screen md:hidden">
        <section className="relative h-[430px] overflow-hidden rounded-b-[36px] bg-[#dce5dd]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,33,27,0.05)_20%,rgba(12,33,27,0.24)_52%,rgba(12,33,27,0.9)_100%)]" />
          <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-md">
            {eyebrow}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h1 className="mb-2 max-w-[12ch] font-sans text-[36px] font-bold leading-[1] tracking-[-0.05em] text-white">
              {title}
            </h1>
            <p className="mb-3 line-clamp-3 text-[14px] leading-[1.55] text-white/[0.76]">
              {subtitle}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-white/[0.68]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 21s6-4.2 6-10a6 6 0 1 0-12 0c0 5.8 6 10 6 10Z" strokeWidth="1.8" />
                <circle cx="12" cy="11" r="2.3" strokeWidth="1.8" />
              </svg>
              {address}
            </div>
          </div>
        </section>

        <section className="px-4 pt-7">
          <p className="app-kicker">Das Projekt</p>
          <h2 className="app-section-title">Gemeinschaft mit eigener Haltung.</h2>
          <div className="mt-4">
            {intro.map((paragraph) => (
              <p key={paragraph} className="text-[15px] leading-[1.72] text-[#4f5b54]">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-7 px-4">
          <p className="app-kicker">Was das Projekt prägt</p>
          <div className="mt-3 overflow-hidden rounded-[26px] bg-white/[0.78]">
            {highlights.map((item, index) => (
              <div key={item.label} className="flex gap-4 border-b border-[var(--line)] p-4 last:border-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-[#e3ece5] text-[12px] font-bold text-[#285849]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-[13px] font-bold">{item.label}</div>
                  <p className="mb-0 mt-1 text-[12px] leading-[1.55] text-[var(--muted)]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 px-4">
          <p className="app-kicker">Steckbrief</p>
          <div className="mt-3 rounded-[26px] bg-[#183f36] px-5 py-2 text-white">
            {facts.map((fact) => (
              <div key={fact.label} className="border-b border-white/10 py-4 last:border-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#a9cdbd]">{fact.label}</div>
                <div className="mt-1.5 text-[14px] font-semibold leading-[1.5]">{fact.value}</div>
              </div>
            ))}
          </div>
          <a
            href={website.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex min-h-[52px] items-center justify-between rounded-[18px] bg-white/[0.78] px-4 text-[13px] font-bold text-[#245245]"
          >
            {website.label}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 5h5v5M19 5l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </section>

        {cta && (
          <section className="mx-4 mt-7 rounded-[28px] bg-[#eee2d5] p-5">
            <p className="app-kicker">Zusatzangebot</p>
            <h2 className="mb-2 font-sans text-[24px] font-bold leading-[1.1] tracking-[-0.035em]">{cta.title}</h2>
            <p className="mb-4 text-[13px] leading-[1.6] text-[var(--muted)]">{cta.text}</p>
            <Link href={cta.href} target="_blank" rel="noopener noreferrer" className="flex min-h-[50px] items-center justify-between rounded-[18px] bg-[#183f36] px-4 text-[13px] font-bold text-white">
              {cta.label}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M14 7l5 5-5 5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="mt-9">
            <div className="px-4">
              <p className="app-kicker">Eindrücke</p>
              <h2 className="app-section-title">Bilder aus dem Projekt</h2>
            </div>
            <div className="scrollbar-none mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
              {gallery.map((image) => (
                <div key={image.src} className="relative h-[260px] w-[82vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-[28px] bg-[#dce5dd]">
                  <Image src={image.src} alt={image.alt} fill sizes="82vw" className="object-cover" />
                </div>
              ))}
              <div className="w-1 shrink-0" aria-hidden="true" />
            </div>
          </section>
        )}
      </div>

      <div className="hidden pt-16 md:block">
      <section className="section pb-14 md:pb-18">
        <div className="container-custom">
          <div className="section-shell">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(380px,1.08fr)] lg:items-center">
              <div>
                <span className="eyebrow mb-5">{eyebrow}</span>
                <h1 className="max-w-[11ch] text-[clamp(2.8rem,5vw,4.8rem)]">{title}</h1>
                <p className="max-w-[620px] text-[18px] leading-[1.8] text-[var(--muted)]">
                  {subtitle}
                </p>
                <div className="mt-8 rounded-[24px] border border-[var(--line)] bg-white/76 px-5 py-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8b7b6c]">
                    Adresse
                  </div>
                  <p className="mb-0 mt-2 text-[16px] leading-[1.7] text-[#4f5b54]">{address}</p>
                </div>
              </div>

              <div className="relative">
                <div className="overflow-hidden rounded-[34px] border border-[var(--line)] shadow-[0_30px_70px_rgba(38,82,62,0.14)]">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    width={1400}
                    height={940}
                    className="h-[290px] w-full object-cover sm:h-[430px] md:h-[540px]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.02fr)_380px]">
            <div className="editorial-panel p-6 md:p-9">
              <span className="eyebrow mb-4">Projektporträt</span>
              {intro.map((paragraph) => (
                <p key={paragraph} className="max-w-[64ch] text-[17px] leading-[1.85] text-[#4f5b54]">
                  {paragraph}
                </p>
              ))}

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-5"
                  >
                    <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                      {item.label}
                    </div>
                    <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-[#4f5b54]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <aside className="editorial-panel p-6 md:p-7">
                <span className="eyebrow mb-4">Steckbrief</span>
                <div className="space-y-4">
                  {facts.map((fact) => (
                    <div key={fact.label} className="border-b border-[var(--line)] pb-4 last:border-0 last:pb-0">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                        {fact.label}
                      </div>
                      <p className="mb-0 mt-2 text-[15px] leading-[1.7] text-[#4f5b54]">{fact.value}</p>
                    </div>
                  ))}
                  <div className="border-t border-[var(--line)] pt-4">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                      Website
                    </div>
                    <a
                      href={website.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-[15px] font-semibold text-[var(--accent)] hover:text-[#9d482a]"
                    >
                      {website.label}
                    </a>
                  </div>
                </div>
              </aside>

              {cta && (
                <aside className="rounded-[30px] border border-[rgba(31,77,67,0.12)] bg-[linear-gradient(160deg,#1f4d43_0%,#305f54_100%)] px-6 py-6 text-white shadow-[0_28px_60px_rgba(38,82,62,0.14)]">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#d6c7bb]">
                    Zusatzangebot
                  </div>
                  <h2 className="mt-4 text-[34px] leading-[1.02] text-white">{cta.title}</h2>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.75] text-[#ede2d7]">{cta.text}</p>
                  <Link href={cta.href} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6 w-full border-white/20 bg-white/10 text-white hover:bg-white/14 hover:text-white sm:w-auto">
                    {cta.label}
                  </Link>
                </aside>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-8">
        <div className="container-custom">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow mb-4">Eindrücke</span>
              <h2 className="max-w-[10ch]">Bilder aus dem Projekt.</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {gallery.map((image, index) => (
              <div
                key={image.src}
                className={`overflow-hidden rounded-[30px] border border-[var(--line)] bg-white/72 shadow-[0_18px_44px_rgba(38,82,62,0.06)] ${
                  index === 0 ? 'md:col-span-2 xl:col-span-2' : ''
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={800}
                  className={`w-full object-cover ${index === 0 ? 'h-[280px] md:h-[430px]' : 'h-[240px] md:h-[320px]'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
