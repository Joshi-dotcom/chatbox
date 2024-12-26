import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import Message from './Message';
import { MessageType, User } from '../types';
import { friendResponses } from '../utils/responses';

export default function ChatBox() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const currentUser: User = {
    id: 'user1',
    name: 'You',
    status: '✨ Active now'
  };
  
  const friend: User = {
    id: 'user2',
    name: 'Best Friend',
    status: '🎮 Playing games',
    lastSeen: new Date()
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: MessageType = {
      id: Date.now(),
      text: newMessage,
      sender: currentUser.id,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages([...messages, message]);
    setNewMessage('');

    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage: MessageType = {
        id: Date.now() + 1,
        text: friendResponses[Math.floor(Math.random() * friendResponses.length)],
        sender: friend.id,
        timestamp: new Date(),
        type: 'text',
        status: 'read'
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageMessage: MessageType = {
      id: Date.now(),
      text: '📸 Shared a photo',
      imageUrl: URL.createObjectURL(file),
      sender: currentUser.id,
      timestamp: new Date(),
      type: 'image',
      status: 'sent'
    };

    setMessages([...messages, imageMessage]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage: MessageType = {
        id: Date.now() + 1,
        text: "Nice pic! 📸",
        sender: friend.id,
        timestamp: new Date(),
        type: 'text',
        status: 'read'
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2500);
  };

  const sendNotification = () => {
    const notification: MessageType = {
      id: Date.now(),
      text: '🎮 Sent a game invite',
      sender: currentUser.id,
      timestamp: new Date(),
      type: 'notification'
    };

    setMessages([...messages, notification]);

    setTimeout(() => {
      const responseNotification: MessageType = {
        id: Date.now() + 1,
        text: '🎮 Accepted game invite',
        sender: friend.id,
        timestamp: new Date(),
        type: 'notification'
      };
      setMessages(prev => [...prev, responseNotification]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <ChatHeader otherUser={friend} isTyping={isTyping} />
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
        {messages.map((message) => (
          <Message 
            key={message.id}
            message={message}
            isOwn={message.sender === currentUser.id}
          />
        ))}
      </div>

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSubmit={sendMessage}
        onImageUpload={handleImageUpload}
        onNotification={sendNotification}
      />
    </div>
  );
}
