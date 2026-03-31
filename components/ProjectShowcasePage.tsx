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
    <div className="pt-16">
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
  )
}
