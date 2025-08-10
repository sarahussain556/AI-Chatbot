// src/components/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, X } from 'lucide-react';
import './Chatbot.css'; // We'll create this CSS file

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Sara's AI assistant. I can help you with information about her portfolio, skills, and projects. How can I assist you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const getRuleBasedResponse = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    
    const keywords = {
      greetings: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
      portfolio: ["portfolio", "work", "projects", "website", "examples", "showcase"],
      skills: ["skills", "technology", "tech", "programming", "react", "javascript", "next.js", "angular"],
      experience: ["experience", "work experience", "job", "company", "ttn", "to the new"],
      education: ["education", "degree", "college", "university", "mca", "jamia"],
      contact: ["contact", "email", "phone", "reach", "connect", "hire", "linkedin", "github"],
      projects: ["buzz", "nameit", "application", "app", "social media", "project details"],
      help: ["help", "support", "assist", "guidance", "information"],
      thanks: ["thank", "thanks", "appreciate", "grateful"],
      about: ["about", "who are you", "what are you"],
      goodbye: ["bye", "goodbye", "see you", "farewell"]
    };

    const responses = {
      greetings: [
        "Hello! Welcome to Sara's portfolio assistant. How can I help you learn more about her work?",
        "Hi there! I'm here to help you explore Sara's skills and experience. What would you like to know?"
      ],
      portfolio: [
        "You can view Sara's complete portfolio at my-portfolio-nine-olive-49.vercel.app. It showcases her React, Next.js, and Angular projects!",
        "Sara's portfolio includes web applications, insurance platforms, and social media projects."
      ],
      skills: [
        "Sara specializes in: React.js, Next.js 15, AngularJS, JavaScript, HTML5, CSS3, Material-UI, Tailwind CSS, Node.js, MongoDB, and RESTful APIs!",
        "Her technical expertise includes modern React patterns, performance optimization, and responsive design."
      ],
      experience: [
        "Sara has 3+ years at To The New Pvt Ltd, working on bhartiaxa.com insurance website, TV connection apps, and PWC India projects.",
        "Currently at To The New, she's led Material-UI migrations, React upgrades, and complex API integrations."
      ],
      education: [
        "Sara holds a Master's in Computer Application (MCA) from Jamia Millia Islamia with 9.19/10 CGPA, completed in 2022."
      ],
      contact: [
        "You can reach Sara at:\n📧 sarahussain1398@gmail.com\n📱 8299076805\n💼 LinkedIn: linkedin.com/in/sara-hussain-07359b207\n🔗 GitHub: github.com/sarahussain556"
      ],
      projects: [
        "Sara's key projects include:\n🔵 Buzzz Social Media App (React, Node.js, MongoDB)\n🔵 NameIt Domain Suggestion Tool (React)\n🔵 BhartiAXA Insurance Platform\nWould you like details about any specific project?"
      ],
      help: [
        "I can help you learn about:\n• Sara's technical skills\n• Her portfolio projects\n• Contact information\n• Educational background\nWhat interests you most?"
      ],
      thanks: [
        "You're very welcome! Is there anything else you'd like to know about Sara's work?",
        "Happy to help! Feel free to ask more questions."
      ],
      about: [
        "I'm Sara's portfolio assistant, designed to help visitors learn about her software engineering expertise and projects!"
      ],
      goodbye: [
        "Thanks for your interest in Sara's work! Don't forget to check out her portfolio. Have a great day!"
      ]
    };

    for (const [category, keywordList] of Object.entries(keywords)) {
      debugger
      if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
        debugger
        const categoryResponses = responses[category];
        debugger
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
      }
    }

    return "That's an interesting question! For more specific details, I'd recommend reaching out to Sara directly at sarahussain1398@gmail.com";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const botResponse = getRuleBasedResponse(inputValue);
      debugger
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Toggle Button */}
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
          <span className="notification-badge">!</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div className="header-text">
                <span className="bot-name">Sara's Assistant</span>
                <div className="status">Online</div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  {message.sender === 'bot' && (
                    <div className="message-avatar bot-msg-avatar">
                      <Bot size={16} />
                    </div>
                  )}
                  <div className={`message-bubble ${message.sender}-bubble`}>
                    <p className="message-text">{message.text}</p>
                    <p className="message-time">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="message-avatar user-msg-avatar">
                      <User size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="message-avatar bot-msg-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-container">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Sara's skills, projects, or experience..."
              className="message-input"
              rows="1"
              disabled={isLoading}
              maxLength="500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="send-btn"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;