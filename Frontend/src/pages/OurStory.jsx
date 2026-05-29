import React from 'react';
import { Link } from 'react-router-dom';
import imagesection from '../assets/home/imagesection.png?w=1200&format=webp&quality=80';
import image1 from '../assets/home/image1.png?w=720&format=webp&quality=80';
import image3 from '../assets/home/image3.png?w=720&format=webp&quality=80';
import image4 from '../assets/home/image4.png?w=720&format=webp&quality=80';
import image5 from '../assets/home/image5.png?w=720&format=webp&quality=80';
import image13 from '../assets/home/image13.png?w=720&format=webp&quality=80';

const Icon = ({ children }) => (
  <svg
    className="w-7 h-7"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const OurStory = () => {
  const journey = [
    {
      year: '2018',
      title: 'Where It All Began',
      text: 'Started with a passion for curated gifts and a dream to spread happiness.',
      icon: <><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5c0 1.4 2 2.5 2 2.5Z" /><path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5c0 1.4-2 2.5-2 2.5Z" /></>,
    },
    {
      year: '2020',
      title: 'Growing With Love',
      text: 'Expanded our collection and reached more customers who trusted us with their moments.',
      icon: <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></>,
    },
    {
      year: '2022',
      title: 'Personalisation First',
      text: 'Introduced personalised gifts to make every emotion feel extra special.',
      icon: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></>,
    },
    {
      year: 'Today',
      title: 'Still Innovating',
      text: 'Continuing to create beautiful experiences and unforgettable memories, every day.',
      icon: <><path d="M4.5 16.5c-1.5 1.26-2 4-2 4s2.74-.5 4-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
    },
  ];

  const features = [
    ['Curated with Love', 'Handpicked gifts for every occasion and relationship.', <><path d="M12 21s-6-4.35-8.5-8.5A5.25 5.25 0 0 1 12 6a5.25 5.25 0 0 1 8.5 6.5C18 16.65 12 21 12 21Z" /><path d="M12 6V3" /><path d="M9 4h6" /></>],
    ['Premium Quality', 'We ensure only the best quality products for you.', <><path d="M12 2 15 8l6 .9-4.35 4.23L17.7 19 12 16l-5.7 3 1.05-5.87L3 8.9 9 8l3-6Z" /></>],
    ['Personalised Touch', 'Add a personal touch to make it truly unforgettable.', <><path d="M14 9V5a3 3 0 0 0-6 0v4" /><path d="M5 9h12l-1 11H6L5 9Z" /><path d="M19 10l2 2-6 6-3 1 1-3 6-6Z" /></>],
    ['Reliable Delivery', 'On-time delivery to make your moments perfect.', <><path d="M10 17h4V5H2v12h3" /><path d="M14 17h1" /><path d="M19 17h3v-6l-3-4h-5" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>],
    ['Secure Shopping', 'Safe payments and secure checkout, always.', <><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>],
    ['Customer First', 'We are here for you at every step of your gifting journey.', <><path d="M16 21v-2a4 4 0 0 0-8 0v2" /><circle cx="12" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>],
  ];

  const gallery = [image4, image13, image1, image3];

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <section className="relative min-h-[640px] pt-28 pb-36 flex items-center bg-[#fff8f7]">
        <div className="absolute inset-0">
          <img src={imagesection} alt="CRAFTORIA story hero" className="h-full w-full object-cover object-center lg:object-[62%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/78 to-white/5" />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-12 w-full pb-12">
          <div className="max-w-[660px]">
            <h1 className="mb-6 flex flex-col tracking-tight drop-shadow-sm">
              <span className="relative inline-block pb-4">
                <span className="font-script text-red-700 block transform -rotate-1 leading-none" style={{ fontSize: 'clamp(3rem, 6vw, 5.25rem)' }}>
                  Thoughtful
                </span>
                <svg className="absolute -bottom-1 left-12 w-full max-w-[210px] h-5 text-red-700/80" viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 20,15 C 45,11 75,13 92,18 C 95,19 97,22 96,24 C 95,25 93,24 92,22 C 91,20 93,17 97,17 C 101,17 103,19 104,22 C 105,24 103,25 102,24 C 101,22 103,19 106,18 C 123,13 153,11 178,15" />
                </svg>
              </span>
              <span className="font-serif font-bold text-gray-950 block leading-tight" style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)' }}>
                Moments
              </span>
            </h1>
            <p className="font-sans text-base sm:text-[1.05rem] text-gray-700 mb-8 max-w-xl leading-[1.75] font-normal tracking-wide">
              At CRAFTORIA, we believe every gift has the power to create a memory that lasts a lifetime. Forever wrapped in care, we help you express love, gratitude and celebration with gifts that truly matter.
            </p>
            <Link to="/collections" className="inline-flex items-center gap-3 bg-[#760000] text-white action-link px-7 py-4 rounded-sm shadow-[0_12px_24px_rgba(118,0,0,0.18)] hover:bg-[#760000] transition">
              <Icon><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /></Icon>
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-12 -mt-16 relative z-20 pb-8">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-[0_22px_70px_rgba(0,0,0,0.06)] px-5 sm:px-10 lg:px-16 py-10 sm:py-12 mb-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-eyebrow">Our Journey</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-bold text-gray-900 tracking-tight leading-[1.1]">
              From a Simple Idea to<br />
              <span className="text-[#760000]">Meaningful Connections</span>
            </h2>
            <p className="body-copy-sm mt-4">
              CRAFTORIA was born out of a simple idea, to make gifting effortless, personal and memorable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10 relative">
            <div className="hidden md:block absolute left-[12%] right-[12%] top-10 h-px bg-red-100" />
            {journey.map((item) => (
              <div key={item.year} className="relative text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-[#fff3f2] border border-red-100 flex items-center justify-center text-[#760000] mb-5 relative z-10">
                  <Icon>{item.icon}</Icon>
                </div>
                <p className="font-sans text-[#760000] text-sm font-extrabold mb-3">{item.year}</p>
                <h3 className="font-heading text-sm font-semibold text-gray-950 mb-2">{item.title}</h3>
                <p className="body-copy-sm max-w-[210px] mx-auto">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-[0.34fr_0.66fr] rounded-2xl overflow-hidden bg-gradient-to-br from-[#fff7f6] via-white to-[#fff2f0] border border-red-50 shadow-[0_18px_55px_rgba(118,0,0,0.06)] mb-12">
          <div className="relative p-6 sm:p-10 lg:p-12 flex flex-col justify-center overflow-hidden">
            <div className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-red-100/45 blur-3xl" />
            <div className="relative z-10">
              <span className="section-eyebrow">What Makes Us Special</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight leading-tight text-gray-950 mb-5">
                Gifts That Come<br />
                From the <span className="text-[#760000]">Heart</span>
              </h2>
              <p className="body-copy-sm text-gray-700 mb-7 max-w-sm">
                We go beyond just products. We deliver emotions, thoughtfully wrapped with care and love.
              </p>
              <Link to="/collections" className="inline-flex items-center gap-3 bg-[#760000] text-white action-link px-7 py-4 rounded-sm w-max hover:bg-[#760000] transition">
                <Icon><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /></Icon>
                Shop Now
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 flex items-center">
            <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 bg-white/80 backdrop-blur-sm rounded-xl border border-red-100/70 shadow-[0_12px_34px_rgba(118,0,0,0.05)] overflow-hidden">
              {features.map(([title, text, icon]) => (
                <div key={title} className="group p-5 lg:p-7 border-t sm:border-l border-red-100/70 flex gap-4 items-start transition-colors hover:bg-white">
                  <div className="h-11 w-11 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#760000] shrink-0 transition-all group-hover:bg-[#760000] group-hover:text-white group-hover:shadow-[0_10px_24px_rgba(118,0,0,0.18)]">
                    <Icon>{icon}</Icon>
                  </div>
                  <div>
                    <h3 className="font-heading text-[13px] font-semibold text-gray-950 mb-2 tracking-[0.02em]">{title}</h3>
                    <p className="font-sans text-[12.5px] leading-relaxed text-gray-500 font-normal">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[0.38fr_0.62fr] gap-8 lg:gap-10 items-center bg-white rounded-2xl mb-4">
          <div>
            <span className="section-eyebrow">Meet The Team</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight leading-tight text-gray-950 mb-5">
              The People Behind <span className="text-[#760000]">CRAFTORIA</span>
            </h2>
            <p className="body-copy-sm text-gray-700 mb-7 max-w-md">
              A passionate team of dreamers, designers and gift lovers working together to make your gifting experience seamless and special.
            </p>
            <Link to="/our-story" className="inline-flex items-center gap-3 bg-[#760000] text-white action-link px-7 py-4 rounded-sm hover:bg-[#760000] transition">
              <Icon><path d="M16 21v-2a4 4 0 0 0-8 0v2" /><circle cx="12" cy="7" r="4" /></Icon>
              Join Our Journey
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-[1.35fr_0.75fr_0.75fr] gap-3">
            <div className="md:row-span-2 rounded-lg overflow-hidden min-h-[286px]">
              <img src={image5} alt="Gift preparation" className="h-full w-full object-cover" />
            </div>
            {gallery.map((img, index) => (
              <div key={index} className="rounded-lg overflow-hidden min-h-[136px]">
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default OurStory;
