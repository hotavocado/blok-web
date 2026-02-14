import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAction } from 'convex/react';
import { api } from '../convex/api';

const ChatBubble = ({ onClose, onExecuteAction }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'sup boss, what you need?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const sendMessage = useAction(api.chat.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Claude via Convex
      const data = await sendMessage({
        messages: [...messages, userMessage],
      });

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

      // Execute any actions Claude requested
      if (data.action) {
        onExecuteAction(data.action);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{
      position: 'absolute',
      bottom: '100%',
      right: 0,
      marginBottom: '4px',
      width: '380px',
      height: '480px',
      backgroundColor: 'var(--color-surface-1)',
      borderRadius: '28px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    }}>
      {/* Header */}
      <Box sx={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--color-outline-variant)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Typography sx={{
          fontWeight: 700,
          fontSize: '16px',
          color: 'var(--color-on-surface)',
        }}>
          blok cat ai agent
        </Typography>
        <IconButton 
          onClick={onClose}
          size="small"
          sx={{ color: 'var(--color-on-surface)' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
          }}>
            <Box sx={{
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: msg.role === 'user' 
                ? 'var(--color-primary-container)' 
                : 'var(--color-surface-2)',
              color: msg.role === 'user'
                ? 'var(--color-on-primary-container)'
                : 'var(--color-on-surface)',
            }}>
              <Typography sx={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </Typography>
            </Box>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ alignSelf: 'flex-start' }}>
            <CircularProgress size={20} sx={{ color: 'var(--color-primary)' }} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{
        padding: '16px',
        borderTop: '1px solid var(--color-outline-variant)',
      }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'var(--color-on-surface)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: '12px',
              '& fieldset': {
                borderColor: 'var(--color-outline-variant)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--color-outline)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--color-primary)',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatBubble;
