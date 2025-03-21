import LandingDisplay from '@/components/landing-display';
import { Button } from '@/components/ui/button';
import { ArrowBigRight } from 'lucide-react';
import Image from 'next/image';

export default async function Index() {
  return (
    <>
      <section id="landing hero" className="flex flex-col justify-center items-center pt-24 gap-4">
        <h1 className="text-6xl font-semibold">Tell me about a time</h1>
        <p className="text-lg">you spoke confidently about your experiences.</p>
        <div className="flex gap-8">
          <Button variant={'secondary'} className="bg-highlight">
            Get Started <ArrowBigRight />
          </Button>
          <Button>Request a Demo</Button>
        </div>
        <Image
          src={'/snapshot.png'}
          alt={'display of interview screen'}
          width={1080}
          height={640}
          className="mt-12 shadow-md rounded-2xl border-slate-100 border-[1px]"
        />
      </section>
      <div className="flex flex-col gap-36 mt-24 items-center">
        <LandingDisplay
          title={'Your Resume. Your Stories.'}
          desc={'We\'ll let you know the best way to present yourself confidently. Lorem dolor sit amet.'}
          img={{
            src: '/snapshot.png',
            alt: 'dummy',
            width: 640,
            height: 480
          }}
        />
        <LandingDisplay
          invert
          title={'Interview.\nOn Demand.'}
          desc={'Get an instant review on your response. Lorem dolor sit amet.'}
          img={{
            src: '/snapshot.png',
            alt: 'dummy',
            width: 640,
            height: 480
          }}
        />
        <LandingDisplay
          title={'Receive Personalized Feedback.'}
          desc={
            'Craft clear, impactful responses that stand out to employers. Lorem dolor sit amet.'
          }
          img={{
            src: '/snapshot.png',
            alt: 'dummy',
            width: 640,
            height: 480
          }}
        />
      </div>
    </>
  );
}
