import React from 'react';
import './styles/main.css'; 
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './sections/Navbar';
import FloatBall from './sections/FloatBall';
import PersonalSection from './sections/PersonalSection';
import PhotoWallSection from './sections/PhotoWallSection'
import ExperienceSection from './sections/ExperienceSection';
import SkillsSection from './sections/SkillsSection';
import ProjectSection from './sections/ProjectSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <FloatBall />
      <PersonalSection />
      <PhotoWallSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectSection />
      <ContactSection />
      <Footer />
    </LanguageProvider>
  );
}

export default App;