import LandingDisplay from '@/components/landing-display';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default async function Index() {
  return (
    <>
      <section id="landing hero" className="flex flex-col justify-center items-center pt-24 gap-8">
        <div className="text-center flex flex-col justify-center items-center gap-8">
          <h1 className="text-6xl max-w-6xl font-semibold">
            Tell me about a time you spoke confidently about your experiences.
          </h1>
          <p className="text-lg max-w-3xl">
            Ace your next behavioral interview using AI. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam.
          </p>
        </div>
        <div className="flex gap-8">
          <Button variant={'secondary'} className="bg-highlight">
            Start Interviewing <ArrowRight />
          </Button>
          <Button variant={'default'}>Request a Demo</Button>
        </div>
        <Image
          src={'/snapshot.png'}
          alt={'display of interview screen'}
          width={1080}
          height={640}
          className="mt-12 shadow-xl rounded-2xl border-slate-300 border-[1px]"
        />
      </section>
      <div className="flex flex-col gap-36 mt-24 items-center">
        <LandingDisplay
          title={'Your Resume.\nYour Stories.'}
          desc={
            "We'll let you know the best way to present yourself confidently. Lorem dolor sit amet."
          }
          img={{
            src: '/snapshot.png',
            alt: 'dummy',
            width: 640,
            height: 480
          }}
          cta={{
            href: '/',
            text: 'Stand out from the crowd'
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
          cta={{
            href: '/',
            text: 'Secure your next opportunity'
          }}
        />
        <LandingDisplay
          title={'Receive Personalized Feedback.'}
          desc={
            'Craft clear, impactful responses that stand out to employers with our chat agent, Milbert.'
          }
          img={{
            src: '/snapshot.png',
            alt: 'dummy',
            width: 640,
            height: 480
          }}
          cta={{
            href: '/',
            text: 'Unlock your full potential'
          }}
        />
      </div>
    </>
  );
}
