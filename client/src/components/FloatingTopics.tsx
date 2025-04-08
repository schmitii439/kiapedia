import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { Topic } from '@shared/schema';

interface FloatingTopicsProps {
  topics: Topic[];
}

const FloatingTopics: React.FC<FloatingTopicsProps> = ({ topics }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || topics.length === 0) return;

    // Clear any existing elements in the container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Create and animate floating topic elements
    topics.slice(0, 9).forEach((topic, index) => {
      // Create topic element
      const topicElement = document.createElement('div');
      topicElement.className = 'topic-float absolute bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 dark:bg-gray-800 dark:border-gray-700';
      
      // Set random position attributes
      topicElement.style.setProperty('--delay', `${index * 0.2}s`);
      topicElement.style.setProperty('--x-offset', `${Math.random() * 20 - 10}px`);
      topicElement.style.setProperty('--y-offset', `${Math.random() * 20 - 10}px`);
      
      // Set initial position in the container
      const topPosition = 10 + (Math.random() * 60); // 10% to 70% from top
      const leftPosition = 10 + (Math.random() * 70); // 10% to 80% from left
      topicElement.style.top = `${topPosition}%`;
      topicElement.style.left = `${leftPosition}%`;
      
      // Create and add inner content
      const titleEl = document.createElement('h3');
      titleEl.className = 'font-medium';
      titleEl.textContent = topic.title;
      
      const centuryEl = document.createElement('p');
      centuryEl.className = 'text-sm text-gray-500 dark:text-gray-400';
      centuryEl.textContent = `${topic.century}. Jahrhundert`;
      
      topicElement.appendChild(titleEl);
      topicElement.appendChild(centuryEl);
      
      // Add click event to navigate to topic detail
      topicElement.addEventListener('click', () => {
        window.location.href = `/topic/${topic.id}`;
      });
      
      // Add to container
      containerRef.current?.appendChild(topicElement);
      
      // Animate entry with GSAP
      gsap.fromTo(
        topicElement, 
        { opacity: 0, y: 20 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          delay: index * 0.2,
          ease: "power2.out"
        }
      );
    });
    
    // Setup random gentle movements
    topics.slice(0, 9).forEach((_, index) => {
      const element = containerRef.current?.children[index] as HTMLElement;
      if (element) {
        gsap.to(element, {
          x: `random(-15, 15)`,
          y: `random(-15, 15)`,
          duration: 6 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3
        });
      }
    });
    
  }, [topics]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
    >
      {/* Topic elements will be dynamically created here */}
    </div>
  );
};

export default FloatingTopics;
