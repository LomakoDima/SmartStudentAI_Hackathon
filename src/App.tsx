import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DataHub from './components/DataHub';
import Services from './components/Services';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Compare from './components/Compare';
import CampusTour3D from './components/CampusTour3D';
import AITutor from './components/AITutor';
import KnowledgeConverter from './components/KnowledgeConverter';
import ConverterResult from './components/ConverterResult';
import AdmissionHelper from './components/AdmissionHelper';
import Profile from './components/Profile';
import AboutUniversity from './components/AboutUniversity';
import AcademicPrograms from './components/AcademicPrograms';
import International from './components/International';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Set initial page on first load
    const hash = window.location.hash.slice(1).split('?')[0] || 'home';
    setCurrentPage(hash);
    
    // Mark initial load as complete after a short delay
    setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (isInitialLoad) return;
    
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1).split('?')[0] || 'home';
      
      // Only animate if changing to a different page type
      const isHomePage = ['home', 'datahub', 'services'].includes(hash);
      const wasHomePage = ['home', 'datahub', 'services'].includes(currentPage);
      
      if (hash !== currentPage && !(isHomePage && wasHomePage)) {
        // Start exit animation
        setIsExiting(true);
        
        // After exit animation, change page and start enter animation
        setTimeout(() => {
          setCurrentPage(hash);
          setIsExiting(false);
          setIsEntering(true);
          
          // Scroll to top for new pages (not home page sections)
          if (!isHomePage) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          
          // Reset entering state after animation
          setTimeout(() => {
            setIsEntering(false);
          }, 400);
        }, 300);
      } else if (hash !== currentPage) {
        // For home page sections, just update and scroll smoothly
        setCurrentPage(hash);
        if (isHomePage) {
          setTimeout(() => {
            const targetElement = document.getElementById(hash === 'home' ? 'home' : hash);
            if (targetElement) {
              targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 100);
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);

    // Handle smooth scroll for anchor links on home page
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (link) {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          const targetId = href.slice(1);
          
          // If it's a home page section, prevent default and scroll smoothly
          if (['home', 'datahub', 'services'].includes(targetId)) {
            e.preventDefault();
            window.location.hash = href;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
              setTimeout(() => {
                targetElement.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }, 50);
            }
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [currentPage, isInitialLoad]);

  const renderPage = () => {
    if (currentPage === 'auth' || currentPage === 'login' || currentPage === 'register') {
      const mode = currentPage === 'register' ? 'register' : 'login';
      return <Auth initialMode={mode} />;
    }

    if (currentPage === 'compare') {
      return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 ${isEntering && !isInitialLoad ? 'page-enter' : ''}`}>
          <Header />
          <Compare />
          <Footer />
        </div>
      );
    }

    if (currentPage === 'tour' || currentPage === '3d-tour' || currentPage === 'campus-tour') {
      return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 ${isEntering && !isInitialLoad ? 'page-enter' : ''}`}>
          <Header />
          <CampusTour3D />
          <Footer />
        </div>
      );
    }

    if (currentPage === 'ai-tutor' || currentPage === 'tutor') {
      return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 ${isEntering && !isInitialLoad ? 'page-enter' : ''}`}>
          <AITutor />
        </div>
      );
    }

    if (currentPage === 'converter' || currentPage === 'knowledge-converter') {
      return (
        <div className={isEntering && !isInitialLoad ? 'page-enter' : ''}>
          <KnowledgeConverter />
        </div>
      );
    }

    if (currentPage === 'converter-result') {
      return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 ${isEntering && !isInitialLoad ? 'page-enter' : ''}`}>
          <ConverterResult />
        </div>
      );
    }

    if (currentPage === 'admission' || currentPage === 'admission-helper') {
      return (
        <div className={isEntering && !isInitialLoad ? 'page-enter' : ''}>
          <AdmissionHelper />
        </div>
      );
    }

    if (currentPage === 'profile' || currentPage === 'my-profile') {
      return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 ${isEntering && !isInitialLoad ? 'page-enter' : ''}`}>
          <Header />
          <Profile />
          <Footer />
        </div>
      );
    }

    if (currentPage === 'about-university') {
      return (
        <div className={isEntering && !isInitialLoad ? 'page-enter' : ''}>
          <AboutUniversity />
        </div>
      );
    }

    if (currentPage === 'academic-programs') {
      return (
        <div className={isEntering && !isInitialLoad ? 'page-enter' : ''}>
          <AcademicPrograms />
        </div>
      );
    }

    if (currentPage === 'international') {
      return (
        <div className={isEntering && !isInitialLoad ? 'page-enter' : ''}>
          <International />
        </div>
      );
    }

    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 ${isEntering && !isInitialLoad ? 'page-enter' : ''}`}>
        <Header />
        <section id="home">
          <Hero />
        </section>
        <section id="datahub">
          <DataHub />
        </section>
        <section id="services">
          <Services />
        </section>
        <Footer />
      </div>
    );
  };

  return (
    <div className={isExiting ? 'page-exit' : ''}>
      {renderPage()}
    </div>
  );
}

export default App;
