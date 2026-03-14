import React, { useState, useEffect } from 'react';
import '../App.css';

const steps = [
  {
    target: 'step-0',
    title: 'Welcome!',
    content: 'This tool helps you improve your English pronunciation using AI.',
  },
  {
    target: 'step-1',
    title: '1. Select Assessment Mode',
    content: 'Choose "Score given text" to read a specific prompt, or "Free reading score" to speak spontaneously about a topic.',
  },
  {
    target: 'step-2',
    title: '2. Start Recording',
    content: 'Click this button and start speaking. We use Wasm-powered audio processing to ensure high quality.',
  },
  {
    target: 'step-3',
    title: '3. Review Results',
    content: 'After recording, you will see detailed pronunciation scores. You can also generate a deep AI analysis report!',
  },
];

const TutorialDialog = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const step = steps[currentStep];
      const element = document.getElementById(step.target);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Ensure the element is visible
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        if (currentStep === 0) {
           setStyle({
             position: 'fixed',
             top: '50%',
             left: '50%',
             transform: 'translate(-50%, -50%)',
             zIndex: 1001
           });
        } else {
           // Position below or above the element
           const top = rect.bottom + window.scrollY + 20;
           const left = rect.left + window.scrollX + (rect.width / 2);
           
           setStyle({
             position: 'absolute',
             top: `${top}px`,
             left: `${left}px`,
             transform: 'translateX(-50%)',
             zIndex: 1001
           });
        }

        element.classList.add('tutorial-highlight');
        return () => {
          element.classList.remove('tutorial-highlight');
        };
      }
    };

    const timer = setTimeout(updatePosition, 150);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      steps.forEach(s => {
        const el = document.getElementById(s.target);
        if (el) el.classList.remove('tutorial-highlight');
      });
    };
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="tutorial-overlay" onClick={onClose}>
      <div 
        className="tutorial-content step-by-step" 
        style={style} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tutorial-progress">
          Step {currentStep + 1} of {steps.length}
        </div>
        <h3>{step.title}</h3>
        <p>{step.content}</p>
        
        <div className="tutorial-actions">
          {currentStep > 0 && (
            <button className="tutorial-btn secondary" onClick={handleBack}>
              Back
            </button>
          )}
          <button className="tutorial-btn primary" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
        
        <button className="tutorial-skip" onClick={onClose}>Skip Tutorial</button>
      </div>
    </div>
  );
};

export default TutorialDialog;
