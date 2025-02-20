import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import { useUser } from '@clerk/clerk-react';
import { Spinner } from '@chakra-ui/react';

const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false); // New state for spinner
  const Navigate = useNavigate();
  const { setRoomID } = useUserStore();
  const { user } = useUser();
  const username = user?.username;

  useEffect(() => {
    if (username == '') {
      Navigate('/auth');
    }
  });

  const handleGenerateRoomId = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!roomId || !roomName) {
      alert('Fill name and id');
      return;
    }
    setLoading(true);
    const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;
    let url = '';
    if (serverUrl === '://localhost:8080') {
      url = `http${serverUrl}`;
    } else {
      url = `https${serverUrl}`;
    }
    try {
      const response = await fetch(`${url}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          roomName,
          roomId,
        }),
      });
      setLoading(false);
      if (response.ok) {
        // Add a toast here
        setRoomID(roomId);
        Navigate('/join');
      } else {
        alert('Error creating room');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-blue-200 flex flex-col justify-center items-center">
      <h2 className="text-3xl mb-4">Create Room</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="bg-blue-900 text-blue-200 border-b border-blue-400 rounded mb-4 px-3 py-2"
        />
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={roomId}
            readOnly
            className="bg-blue-900 text-blue-200 border-b border-blue-400 rounded-l px-3 py-2"
          />
          <button
            type="button"
            onClick={handleGenerateRoomId}
            className="bg-blue-500 hover:bg-blue-600 text-blue-100 font-semibold px-4 py-2 rounded-r"
          >
            Generate Room ID
          </button>
        </div>

        {roomId && !loading && (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-blue-100 font-semibold px-4 py-2 rounded"
          >
            Create Room
          </button>
        )}

        {loading && (
          <Spinner size="lg" color="blue.500" className="mt-4" />
        )}
      </form>
    </div>
  );
};

export default CreateRoom;
