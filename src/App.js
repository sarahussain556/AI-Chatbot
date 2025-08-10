// src/App.js
import React from 'react';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Sara's Portfolio</h1>
          <p className="hero-subtitle">Software Engineer | React Specialist | AI Enthusiast</p>
          <div className="hero-buttons">
            <a 
              href="https://my-portfolio-nine-olive-49.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Portfolio
            </a>
            <a 
              href="mailto:sarahussain1398@gmail.com"
              className="btn btn-secondary"
            >
              Contact Me
            </a>
          </div>
          <div className="chatbot-hint">
            <p>💬 Try the AI assistant in the bottom right corner!</p>
          </div>
        </div>
      </header>

      <section className="about-section">
        <div className="container">
          <h2>About Me</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>Experience</h3>
              <p>
                3+ years of software engineering experience at To The New Pvt Ltd, 
                specializing in React.js, Next.js, and Angular development.
              </p>
            </div>
            <div className="about-card">
              <h3>Skills</h3>
              <p>
                React, Next.js 15, Angular, JavaScript, TypeScript, Node.js, 
                MongoDB, Tailwind CSS, Material-UI, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
}

export default App;