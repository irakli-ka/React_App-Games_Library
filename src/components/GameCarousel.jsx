import React, { useState, useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const GameCarousel = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [validImages, setValidImages] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const filtered = (images || []).filter(img => img && typeof img === 'string');
    setValidImages(filtered);
  }, [images]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
    );
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    onTouchEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      onTouchEnd();
    }
  };

  if (!validImages || validImages.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div 
        style={{ 
          position: 'relative', 
          height: '100%', 
          overflow: 'hidden', 
          borderRadius: '4px',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {validImages.length > 1 && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '16px',
            zIndex: 1
          }}>
            <IconButton
              onClick={goToPrevious}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                },
                color: 'white',
              }}
              aria-label="Previous image"
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              onClick={goToNext}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                },
                color: 'white',
              }}
              aria-label="Next image"
            >
              <NavigateNextIcon />
            </IconButton>
          </div>
        )}
        <img
          src={validImages[currentIndex]}
          alt={`${altText} - Image ${currentIndex + 1}`}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable="false"
        />
      </div>
      {validImages.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 1
        }}>
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                height: '8px',
                width: currentIndex === index ? '16px' : '8px',
                borderRadius: '9999px',
                backgroundColor: currentIndex === index 
                  ? 'rgba(255, 255, 255, 1)' 
                  : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameCarousel;