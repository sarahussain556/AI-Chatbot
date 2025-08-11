import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, X, Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Sara's AI assistant. I can help you with information about her portfolio, skills, and projects. You can also start a video call to discuss opportunities! How can I assist you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // WebRTC states
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // Refs
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Initialize WebRTC peer connection
  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection(rtcConfig);
   
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real app, send this to the other peer via signaling server
        console.log('ICE candidate:', event.candidate);
        addBotMessage(`🔗 WebRTC: ICE candidate generated (${event.candidate.type})`);
      }
    };
    
    pc.ontrack = (event) => {
      console.log('Remote stream received');
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    
    pc.onconnectionstatechange = () => {
      setConnectionStatus(pc.connectionState);
      addBotMessage(`📡 Connection state: ${pc.connectionState}`);
    };
    
    return pc;
  };

  // Add bot message helper
  const addBotMessage = (text) => {
    const botMessage = {
      id: Date.now() + Math.random(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Start local media stream
  const startLocalStream = async () => {
    try {
      const constraints = {
        video: isVideoEnabled,
        audio: isAudioEnabled
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      addBotMessage(`❌ Media access error: ${error.message}`);
      throw error;
    }
  };

  // Start video call
  const startCall = async () => {
    try {
      addBotMessage("📹 Starting video call simulation...");
      
      const stream = await startLocalStream();
      const pc = initializePeerConnection();
      
      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
      
      peerConnection.current = pc;
      setIsCallActive(true);
      
      // Create offer (in real app, this would be sent to the other peer)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      addBotMessage("📤 WebRTC offer created and set as local description");
      addBotMessage("🎯 In a real application, this offer would be sent to Sara via a signaling server");
      
      // Simulate receiving an answer after 2 seconds
      setTimeout(() => {
        simulateRemoteAnswer();
      }, 2000);
      
    } catch (error) {
      console.error('Error starting call:', error);
      addBotMessage(`❌ Call failed: ${error.message}`);
    }
  };

  // Simulate remote peer answer
  const simulateRemoteAnswer = async () => {
    if (!peerConnection.current) return;
    
    try {
      // Create a fake answer
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setRemoteDescription(answer);
      
      addBotMessage("📥 Received answer from Sara (simulated)");
      addBotMessage("✅ WebRTC connection established! You're now connected to Sara's assistant demo");
      
      // Simulate remote video stream
      simulateRemoteStream();
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  // Simulate remote stream (in real app, this comes from the other peer)
  const simulateRemoteStream = () => {
    // Create a colored canvas as fake remote video
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    
    const drawFrame = () => {
      // Create animated gradient background
      const gradient = ctx.createLinearGradient(0, 0, 320, 240);
      gradient.addColorStop(0, `hsl(${Date.now() / 50 % 360}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${(Date.now() / 50 + 180) % 360}, 70%, 50%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 320, 240);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Sara (Simulated)', 160, 120);
      ctx.font = '12px Arial';
      ctx.fillText('Demo Remote Stream', 160, 140);
      
      if (isCallActive) {
        requestAnimationFrame(drawFrame);
      }
    };
    
    drawFrame();
    const fakeStream = canvas.captureStream(30);
    setRemoteStream(fakeStream);
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = fakeStream;
    }
  };

  // End call
  const endCall = () => {
    setIsCallActive(false);
    setConnectionStatus('disconnected');
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      localStreamRef.current = null;
    }
    
    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setRemoteStream(null);
    addBotMessage("📵 Call ended. Thank you for trying the WebRTC demo!");
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        addBotMessage(`📹 Video ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        addBotMessage(`🎤 Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
      }
    }
  };

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
      goodbye: ["bye", "goodbye", "see you", "farewell"],
      call: ["call", "video", "meet", "talk", "webrtc", "voice", "video call"]
    };

    const responses = {
      greetings: [
        "Hello! Welcome to Sara's portfolio assistant with WebRTC capabilities. How can I help you learn more about her work?",
        "Hi there! I'm here to help you explore Sara's skills and experience. You can also start a video call demo! What would you like to know?"
      ],
      portfolio: [
        "You can view Sara's complete portfolio at my-portfolio-nine-olive-49.vercel.app. It showcases her React, Next.js, and Angular projects!",
        "Sara's portfolio includes web applications, insurance platforms, and social media projects."
      ],
      skills: [
        "Sara specializes in: React.js, Next.js 15, AngularJS, JavaScript, HTML5, CSS3, Material-UI, Tailwind CSS, Node.js, MongoDB, WebRTC, and RESTful APIs!",
        "Her technical expertise includes modern React patterns, performance optimization, responsive design, and now WebRTC implementation!"
      ],
      experience: [
        "Sara has 3+ years at To The New Pvt Ltd, working on bhartiaxa.com insurance website, TV connection apps, and PWC India projects.",
        "Currently at To The New, she's led Material-UI migrations, React upgrades, complex API integrations, and real-time communication features."
      ],
      education: [
        "Sara holds a Master's in Computer Application (MCA) from Jamia Millia Islamia with 9.19/10 CGPA, completed in 2022."
      ],
      contact: [
        "You can reach Sara at:\n📧 sarahussain1398@gmail.com\n📱 8299076805\n💼 LinkedIn: linkedin.com/in/sara-hussain-07359b207\n🔗 GitHub: github.com/sarahussain556\n📹 Or start a video call demo above!"
      ],
      projects: [
        "Sara's key projects include:\n🔵 Buzzz Social Media App (React, Node.js, MongoDB)\n🔵 NameIt Domain Suggestion Tool (React)\n🔵 BhartiAXA Insurance Platform\n🔵 WebRTC Chat Demo (You're using it now!)\nWould you like details about any specific project?"
      ],
      help: [
        "I can help you learn about:\n• Sara's technical skills\n• Her portfolio projects\n• Contact information\n• Educational background\n• WebRTC demo (try the video call button!)\nWhat interests you most?"
      ],
      thanks: [
        "You're very welcome! Is there anything else you'd like to know about Sara's work? Feel free to try the video call feature!",
        "Happy to help! Feel free to ask more questions or test the WebRTC video call demo."
      ],
      about: [
        "I'm Sara's enhanced portfolio assistant with WebRTC capabilities, designed to help visitors learn about her software engineering expertise and test real-time communication features!"
      ],
      goodbye: [
        "Thanks for your interest in Sara's work and trying the WebRTC demo! Don't forget to check out her portfolio. Have a great day!"
      ],
      call: [
        "Great question! You can start a video call demo using the video button above. This demonstrates WebRTC peer-to-peer communication - perfect for interviews or project discussions with Sara!"
      ]
    };

    for (const [category, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
      }
    }

    return "That's an interesting question! For more specific details, I'd recommend reaching out to Sara directly at sarahussain1398@gmail.com or try the video call demo above!";
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
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <MessageCircle size={24} />
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#ff4757',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>!</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '400px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Sara's WebRTC Assistant</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {connectionStatus === 'connected' ? '🟢 Connected' : '🔴 Online'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* WebRTC Controls */}
              {!isCallActive ? (
                <button
                  onClick={startCall}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Start video call demo"
                >
                  <Video size={16} />
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleVideo}
                    style={{
                      backgroundColor: isVideoEnabled ? '#28a745' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      cursor: 'pointer'
                    }}
                    title={`${isVideoEnabled ? 'Disable' : 'Enable'} video`}
                  >
                    {isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
                  </button>
                  <button
                    onClick={toggleAudio}
                    style={{
                      backgroundColor: isAudioEnabled ? '#28a745' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      cursor: 'pointer'
                    }}
                    title={`${isAudioEnabled ? 'Mute' : 'Unmute'} audio`}
                  >
                    {isAudioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>
                  <button
                    onClick={endCall}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      cursor: 'pointer'
                    }}
                    title="End call"
                  >
                    <PhoneOff size={16} />
                  </button>
                </>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Video Area */}
          {isCallActive && (
            <div style={{
              backgroundColor: '#000',
              height: '200px',
              position: 'relative',
              display: 'flex'
            }}>
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {/* Local Video (Picture-in-Picture) */}
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  width: '80px',
                  height: '60px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '2px solid white'
                }}
              />
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((message) => (
              <div key={message.id} style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  maxWidth: '80%'
                }}>
                  {message.sender === 'bot' && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <Bot size={12} />
                    </div>
                  )}
                  <div>
                    <div style={{
                      backgroundColor: message.sender === 'user' ? '#007bff' : 'white',
                      color: message.sender === 'user' ? 'white' : 'black',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      whiteSpace: 'pre-line'
                    }}>
                      {message.text}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#666',
                      marginTop: '4px',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}>
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#6c757d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <User size={12} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Bot size={12} />
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    gap: '4px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      animation: 'bounce 1.4s ease-in-out 0s infinite both'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px',
            backgroundColor: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '8px'
          }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Sara's skills, projects, or try 'video call'..."
              style={{
                flex: 1,
                border: '1px solid #ddd',
                borderRadius: '20px',
                padding: '12px 16px',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                maxHeight: '60px'
              }}
              rows="1"
              disabled={isLoading}
              maxLength="500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={{
                backgroundColor: !inputValue.trim() || isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;