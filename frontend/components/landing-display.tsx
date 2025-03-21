import Image from 'next/image';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';

type LandingDisplayProps = {
  title: string;
  desc: string;
  img: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  cta: {
    href: string;
    text: string;
  };
  invert?: boolean;
};

export default function LandingDisplay({
  title,
  desc,
  img,
  cta,
  invert = false
}: LandingDisplayProps) {
  return (
    <div className="max-w-5xl flex gap-12 overflow-y-none">
      {invert && (
        <Image {...img} className="border-highlight border-2 rounded-lg shadow-xl w-1/2" />
      )}
      <div className="flex flex-col justify-center gap-12 w-1/2">
        <div className="flex flex-col gap-4">
          <h2 className="text-5xl font-semibold whitespace-pre-line">{title}</h2>
          <p className="text-xl">{desc}</p>
        </div>
        <Link
          href={cta.href}
          className="text-xl text-highlight2 font-semibold flex gap-4 items-center"
        >
          {cta.text} <MoveRight />
        </Link>
      </div>
      {!invert && (
        <Image {...img} className="border-highlight border-2 rounded-lg shadow-xl w-1/2" />
      )}
    </div>
  );
}
