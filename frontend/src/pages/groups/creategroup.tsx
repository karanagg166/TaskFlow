// CreateGroupPage.tsx
import { FC, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CreateGroupPage: FC = () => {
  const [groupName, setGroupName] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [groupPassword, setGroupPassword] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const createGroup = async () => {
    if (!groupName.trim() || !groupDescription.trim() || !groupPassword.trim()) {
      alert('All fields are required!');
      return; // Prevent submission if fields are empty
    }

    try {
      const id = localStorage.getItem('id');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/${id}/create_group`, {
        name: groupName,
        description: groupDescription,
        password: groupPassword,
        isPrivate,
      });
      if (response.status === 201) {
        alert('Group created successfully!'); // Alert for successful creation
        // Clear the input fields
        setGroupName('');
        setGroupDescription('');
        setGroupPassword('');
        setIsPrivate(false);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center pt-20 pb-20 bg-blue-50">
      <Typography variant="h4" className="mb-8 text-gray-800 font-bold text-center">Create a New Group</Typography>
      <div className="mb-8 w-full max-w-md flex flex-col items-center space-y-4">
        <TextField
          variant="outlined"
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          required
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={groupPassword}
          onChange={(e) => setGroupPassword(e.target.value)}
          required
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              color="primary"
            />
          }
          label="Is this group private?"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={createGroup}
          className="mt-4 bg-lightblue-600 hover:bg-lightblue-700"
        >
          Create Group
        </Button>
      </div>
    </div>
  );
};

export default CreateGroupPage;
