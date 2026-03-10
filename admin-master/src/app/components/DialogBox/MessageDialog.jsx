"use client"
import React, { useState } from 'react';
import { FaPaperclip, FaPaperPlane, FaTimes } from 'react-icons/fa';

const MessageDialog = ({ isOpen, onClose,  onSendMessage}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSend = () => {
    if (message.trim()) {
        onSendMessage(message);
      setMessage('');
      setIsTyping(false);
    }
  };

  if (!isOpen) return null; // Don't render if dialog is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button onClick={() => onClose()} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-gray-700">Send a Message</h3>

        <div className="flex items-center bg-gray-100 rounded px-2 py-2 space-x-3">
          {/* Attachment Button */}
          {/* <button className="text-gray-500 hover:text-blue-500">
            <FaPaperclip size={20} />
          </button> */}

          {/* Input Field */}
          <textarea
            type="text"
            rows={4}
            cols={40}
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />

         
        </div>

        {/* Typing Indicator */}
        {isTyping && <p className="text-sm text-gray-500 mt-2">Typing...</p>}
        {/* Send Button */}
        <div className='flex w-full justify-end'> 
          <button
            onClick={handleSend}
            className={`text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition duration-200 ${
              message.trim() ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!message.trim()}
          >
            <FaPaperPlane size={16} />
          </button></div>
      </div>
    </div>
  );
};

export default MessageDialog;
