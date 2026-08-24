import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loader from './components/Loader';
import Nav from './components/Nav';
import ParticlesBackground from './components/ParticlesBackground';
import HeroCanvas from './components/HeroCanvas';
import Marquee from './components/Marquee';
import Developer from './components/Developer';
import BuildLog from './components/BuildLog';
import ProjectsCarousel from './components/ProjectsCarousel';
import Stack from './components/Stack';
import CodeExperience from './components/CodeExperience';
import Process from './components/Process';
import Contact from './components/Contact';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/contactform" element={<ContactForm />} />
        <Route path="/" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

function Portfolio() {
  return (
    <>
      <Loader />
      <ParticlesBackground />

      <main id="top">
        <Nav />
        <HeroCanvas />
        <Marquee />
        <Developer />
        <BuildLog />
        <ProjectsCarousel />
        <Stack />
        <CodeExperience />
        <Process />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
