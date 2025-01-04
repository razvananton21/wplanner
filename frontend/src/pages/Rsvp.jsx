import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import RsvpForm from '../components/RsvpForm';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #8b9d8a;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const InvitationCard = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1/1.4142;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
  cursor: pointer;
  margin: 0;
  padding: 0;
`;

const CardSide = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

const CardFront = styled(CardSide)`
  background-image: url('/images/invitation-front.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #f5f2e8;
`;

const CardBack = styled(CardSide)`
  background-image: url('/images/invitation-back.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #f5f2e8;
  transform: rotateY(180deg);
`;

const DragIndicator = styled(motion.div)`
  position: absolute;
  top: 50%;
  ${props => props.side === 'left' ? 'left: 1rem' : 'right: 1rem'};
  color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  font-size: 2rem;
  transform: translateY(-50%);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  pointer-events: none;
`;

const FloatingMenu = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 100;

  & > * {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover > *:not(:hover) {
    transform: scale(0.95);
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    gap: 0.5rem;
  }
`;

const CircleButton = styled(motion.button)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6741;
  font-size: 1.25rem;
  
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: rgba(74, 103, 65, 0.1);
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &:hover::before {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid #4a6741;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1rem;
  }
`;

const ModernModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;

  @media (max-height: 800px) {
    align-items: flex-start;
    padding: 1rem;
  }
`;

const InteractionHint = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
  z-index: 10;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const MainPage = ({ initialData }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();
  const [isOpen, setIsOpen] = useState(!!initialData);

  const handleDownloadPDF = () => {
    window.open('/invitation.pdf', '_blank');
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    setShowHint(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          isVegetarian: formData.diet === 'vegetarian',
          preferences: formData.preferences,
          additionalGuests: formData.additionalGuests,
          invitationId: formData.invitationId
        })
      });
      // ... rest of the code
    } catch (error) {
      // ... error handling
    }
  };

  return (
    <PageContainer>
      <InvitationCard
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
          }
        }}
        whileHover={{ scale: 1.02 }}
        drag="x"
        dragControls={dragControls}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, { offset }) => {
          setIsDragging(false);
          if (Math.abs(offset.x) > 100) {
            setIsFlipped(!isFlipped);
            setShowHint(false);
          }
        }}
        onClick={handleCardClick}
      >
        <CardFront>
          {/* Remove this block
          <InteractiveElement
            style={{ top: '30%', left: '50%', transform: 'translateX(-50%)' }}
            animate={{ 
              y: [0, -5, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </InteractiveElement>
          */}
        </CardFront>
        <CardBack />

        <AnimatePresence>
          {isDragging && (
            <>
              <DragIndicator 
                side="left" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
              >
                ←
              </DragIndicator>
              <DragIndicator 
                side="right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
              >
                →
              </DragIndicator>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHint && (
            <InteractionHint
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 1 }}
            >
              <motion.span
                animate={{ x: [-3, 3, -3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                👆
              </motion.span>
              Atinge pentru a deschide
            </InteractionHint>
          )}
        </AnimatePresence>
      </InvitationCard>

      <FloatingMenu>
        <AnimatePresence>
          <CircleButton
            key="rsvp"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRsvpForm(true)}
            title="RSVP"
            aria-label="Deschide formularul RSVP"
          >
            ✓
          </CircleButton>

          <CircleButton
            key="flip"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFlipped(!isFlipped)}
            title={isFlipped ? "Închide invitația" : "Deschide invitația"}
            aria-label={isFlipped ? "Închide invitația" : "Deschide invitația"}
          >
            {isFlipped ? "✕" : "📩"}
          </CircleButton>

          <CircleButton
            key="pdf"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPDF}
            title="Descarcă PDF"
            aria-label="Descarcă invitația în format PDF"
          >
            ↓
          </CircleButton>
        </AnimatePresence>
      </FloatingMenu>

      <AnimatePresence>
        {showRsvpForm && (
          <ModernModal
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowRsvpForm(false);
              }
            }}
          >
            <RsvpForm initialData={initialData} onClose={() => setShowRsvpForm(false)} />
          </ModernModal>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default MainPage; 