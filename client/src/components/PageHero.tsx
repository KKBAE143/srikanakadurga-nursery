interface PageHeroProps {
  image: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ image, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative w-full h-[240px] sm:h-[300px] overflow-hidden" data-testid="section-page-hero">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl italic" data-testid="text-hero-title">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-base sm:text-lg text-white/90 font-sans" data-testid="text-hero-subtitle">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
