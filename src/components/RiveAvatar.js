import React, { useEffect, useRef, useState } from 'react';
import { Rive, Layout, Fit } from '@rive-app/webgl2';
import { Box, Typography } from '@mui/material';
import ChatBubble from './ChatBubble';

const RiveAvatar = ({ onNavigate, onSignOut }) => {
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const [showChat, setShowChat] = useState(false);

  const handleExecuteAction = (action) => {
    if (action.type === 'navigate') {
      onNavigate?.(action.page);
    } else if (action.type === 'signOut') {
      onSignOut?.();
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const r = new Rive({
      src: '/assets/rive/2992-6574-blobby-cat.riv',
      canvas: canvasRef.current,
      artboard: 'Cat Artboard',
      stateMachines: 'State Machine',
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
      }),
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        console.log('Rive animation loaded and playing');
      },
      onLoadError: (error) => {
        console.error('Rive load error:', error);
      },
    });

    riveRef.current = r;

    const handleResize = () => {
      r.resizeDrawingSurfaceToCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      r.cleanup();
    };
  }, []);

  return (
    <Box sx={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      width: '240px',
      height: '240px',
      zIndex: 1000,
    }}>
      {showChat && (
        <ChatBubble 
          onClose={() => setShowChat(false)}
          onExecuteAction={handleExecuteAction}
        />
      )}
      <Box
        onClick={() => setShowChat(true)}
        sx={{ 
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <canvas 
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: 'calc(50% + 16px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Jua',
            fontWeight: 400,
            fontSize: '32px',
            color: 'var(--color-on-surface)',
            pointerEvents: 'none',
          }}
        >
          ai
        </Typography>
      </Box>
    </Box>
  );
};

export default RiveAvatar;
