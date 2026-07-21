export function Hero() {
  return (
    <section className="py-6 md:py-8 lg:py-10 text-center">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-2">
          Free Online <span className="text-primary">JSON Formatter</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
          Format, validate, beautify, and minify your JSON data securely in your browser.
        </p>
      </div>
    </section>
  );
}
