import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';

function UserSearch() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmed = username.trim();

    if (!trimmed) return;

    navigate(`/list/${encodeURIComponent(trimmed)}`);
    setUsername('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        width: 260,
      }}
    >
      <Paper
        sx={{
          px: 2,
          py: 0.5,
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <InputBase
          placeholder="Search user..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            width: '100%',
            color: 'text.primary',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.8rem',
          }}
        />
      </Paper>
    </Box>
  );
}

export default UserSearch;