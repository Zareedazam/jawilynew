import Link from "next/link";

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="font-black">{title}</div>
      <ul className="mt-3 space-y-2 text-black/60">
        {items.map((x) => (
          <li key={x.href}>
            <Link className="hover:text-black" href={x.href}>
              {x.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-sm">J</div>
            <div className="text-xl font-black">Jawily</div>
          </div>
          <p className="text-black/60 mt-2">Study abroad made simple.</p>
        </div>

        <FooterCol
          title="Services"
          items={[
            { label: "Free Service", href: "/free-service" },
            { label: "Premium", href: "/premium" },
          ]}
        />
        <FooterCol
          title="Study Options"
          items={[
            { label: "Foundation", href: "/foundation" },
            { label: "Undergraduate", href: "/undergraduate" },
            { label: "Postgraduate", href: "/postgraduate" },
            { label: "PhD", href: "/phd" },
          ]}
        />
        <FooterCol
          title="Info"
          items={[
            { label: "Rankings", href: "/rankings" },
            { label: "Scholarships", href: "/scholarships" },
            { label: "Contact", href: "/contact" },
          ]}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-black/50 border-t flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Jawily. All rights reserved.</p>
        <div className="flex gap-4">
          <Link className="hover:text-black" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-black" href="/terms">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
