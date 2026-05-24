export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-muted/30">
      <div className="container-wide flex flex-col gap-3 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Greenfield. A catalogue of the unbuilt.</p>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@greenfield.app" className="hover:text-foreground">Contact</a>
          <a href="/pricing" className="hover:text-foreground">Pricing</a>
        </div>
      </div>
    </footer>
  );
}
