import { Link } from "react-router-dom";

const Header = () => (
  <header className="w-full border-b border-border bg-card py-5">
    <div className="mx-auto max-w-4xl px-4 text-center">
      <Link to="/" className="inline-block">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Cosmic<span className="text-primary">Vision</span>
        </h1>
      </Link>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload an image to detect cosmic rays and particles
      </p>
    </div>
  </header>
);

export default Header;
