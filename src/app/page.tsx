'use client';

import { Poppins } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoginButton } from '@/components/auth/login-button';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

const images = [
  { 
    src: '/school.webp', 
    text: 'Welcome to MCS!', 
    description: '📚 1,200 Students | 👩‍🏫 80 Teachers' 
  },
  { 
    src: '/national.webp', 
    text: 'Honoring Our Nation', 
    description: '🇪🇹 Celebrating Culture & Unity' 
  },
  { 
    src: '/classroom.webp', 
    text: 'A Place for Learning', 
    description: '📖 50+ Well-Equipped Classrooms' 
  },
  { 
    src: '/lab.webp', 
    text: 'Discover Through Science', 
    description: '🔬 Physics, Chemistry, and Biology Labs' 
  },
  { 
    src: '/computer.webp', 
    text: 'Technology for the Future', 
    description: '🖥️ Organized Computer Labs with 50+ PCs' 
  },
  { 
    src: '/play.webp', 
    text: 'Learning Through Play', 
    description: '⚽ Sports & Recreational Activities' 
  },
];

const Page = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <Image 
          src="/school.webp" 
          alt="Hero Background" 
          fill 
          className="object-cover brightness-75"
        />
        <div className="absolute text-center text-white">
          <h1 className={cn('text-4xl md:text-6xl font-bold', font.className)}>Meki Catholic School</h1>
          <p className="mt-4 text-lg md:text-2xl">Here We Build Your Bright Future</p>
          <div className="mt-6 space-x-4">
            <Button  size="lg" className="bg-orange-500 hover:bg-orange-600">Create An Account</Button>
            <LoginButton asChild>
              <Button variant="secondary" size="lg">Sign In</Button>
            </LoginButton>
          </div>
        </div>
      </section>

      {/* Image Slider */}
      <section className="py-16 px-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500 }}
          loop
          className="h-[85vh] w-full"
        >
          {images.map((item, index) => (
            <SwiperSlide key={index} className="flex flex-col items-center">
              <div className="relative w-full h-[60vh] md:h-[70vh]">
                <Image
                  src={item.src}
                  alt={item.text}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{item.text}</h2>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default Page;