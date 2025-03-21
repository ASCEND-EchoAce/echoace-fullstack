import Image from 'next/image';

type LandingDisplayProps = {
  title: string;
  desc: string;
  img: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  invert?: boolean;
};

export default function LandingDisplay({ title, desc, img, invert = false }: LandingDisplayProps) {
  return (
    <div className="max-w-5xl flex gap-12 overflow-y-none">
      {invert && <Image {...img} className="border-highlight border-4 rounded-lg shadow-lg" />}
      <div className="flex flex-col justify-center gap-4 w-1/2">
        <h2 className="text-5xl font-semibold whitespace-pre-line">{title}</h2>
        <p className="text-xl">{desc}</p>
      </div>
      {!invert && <Image {...img} className="border-highlight border-4 rounded-lg shadow-lg" />}
    </div>
  );
}
