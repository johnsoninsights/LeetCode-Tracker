'use client';

import { useState, useEffect } from 'react';
import { BarChart2, Flame, PlusCircle, Filter, Code2, ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'progress', label: 'Progress', icon: <BarChart2 className="w-5 h-5" />, color: '#3B82F6' },
  { id: 'activity', label: 'Activity', icon: <Flame className="w-5 h-5" />, color: '#F97316' },
  { id: 'add-problem', label: 'Add Problem', icon: <PlusCircle className="w-5 h-5" />, color: '#22C55E' },
  { id: 'filters', label: 'Filters', icon: <Filter className="w-5 h-5" />, color: '#A855F7' },
  { id: 'problems', label: 'Problems', icon: <Code2 className="w-5 h-5" />, color: '#EC4899' },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState<string>('progress');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.5;
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.05;
    return 1;
  };

  const getTranslateX = (index: number) => {
    if (hoveredIndex === null) return 0;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 8;
    if (distance === 1) return 4;
    if (distance === 2) return 2;
    return 0;
  };

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        style={{
          position: 'fixed',
          left: '0px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
        }}
        className="hidden md:block"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setHoveredIndex(null);
        }}
      >
        <div className="flex flex-col items-start gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-r-2xl py-4 px-2 shadow-2xl border border-l-0 border-gray-200/50 dark:border-gray-700/50">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.id}
                className="relative flex items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: `scale(${getScale(index)}) translateX(${getTranslateX(index)}px)`,
                  transformOrigin: 'left center',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: isHovered ? 10 : 1,
                }}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      backgroundColor: isActive || isHovered ? item.color : 'transparent',
                      border: `2px solid ${item.color}`,
                      color: isActive || isHovered ? 'white' : item.color,
                      boxShadow: isHovered
                        ? `0 0 20px ${item.color}70`
                        : isActive
                        ? `0 0 12px ${item.color}40`
                        : 'none',
                    }}
                  >
                    {item.icon}
                  </div>

                  <span
                    className="text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 text-gray-700 dark:text-gray-300"
                    style={{
                      maxWidth: isExpanded ? '110px' : '0px',
                      opacity: isExpanded ? 1 : 0,
                      color: isActive ? item.color : undefined,
                    }}
                  >
                    {item.label}
                  </span>
                </button>

                {isActive && !isExpanded && (
                  <div
                    className="absolute -right-1 w-2 h-2 rounded-full border-2 border-white dark:border-gray-900"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </div>
            );
          })}

          <div className="mt-1 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 w-full flex justify-center">
            <ChevronRight
              className="w-3 h-3 text-gray-400 transition-transform duration-300"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div
        style={{ position: 'fixed', bottom: '0px', left: '0px', right: '0px', zIndex: 9999 }}
        className="md:hidden"
      >
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
                  style={{ transform: isActive ? 'translateY(-4px)' : 'translateY(0)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? item.color : 'transparent',
                      color: isActive ? 'white' : item.color,
                      boxShadow: isActive ? `0 0 10px ${item.color}50` : 'none',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: isActive ? item.color : '#9CA3AF' }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}