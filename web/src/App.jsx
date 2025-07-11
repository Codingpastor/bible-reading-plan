import React, { useState, useEffect } from 'react';
import './App.css';
import planData from './reading-plan-with-dates';
import logo from './logo.png';

function passageLink(passage) {
  if (!passage) return null;
  // Remove extra spaces, replace ' - ' with '-', handle commas, ensure space after semicolons
  let formatted = passage
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*,\s*/g, ', ')
    .replace(/;\s*/g, '; ')
    .replace(/\s+/g, ' ')
    .trim();
  // Remove double spaces that may result from replacements
  formatted = formatted.replace(/  +/g, ' ');
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(formatted)}&version=NIV`;
}

function getCurrentWeekIndex(plan, today) {
  const releaseDate = new Date('2025-09-08');
  if (today < releaseDate) return 0;
  for (let i = plan.length - 1; i >= 0; i--) {
    if (today >= new Date(plan[i].date)) return i;
  }
  return 0;
}

// Adding Bible resources and advice for reading scripture
const bibleResources = [
  { name: 'Bible Hub', url: 'https://biblehub.com/' },
  { name: 'Bible Gateway', url: 'https://www.biblegateway.com/' },
  { name: 'Blue Letter Bible', url: 'https://www.blueletterbible.org/' },
  { name: 'YouVersion', url: 'https://www.youversion.com/' }
];

export default function App() {
  const [weekIndex, setWeekIndex] = useState(0);
  
  useEffect(() => {
    const today = new Date();
    setWeekIndex(getCurrentWeekIndex(planData, today));
  }, []);

  const week = planData[weekIndex];

  return (
    <div className="container">
      <header className="header">
        <img 
          src={logo} 
          alt="K-ZMC logo" 
          className="logo"
        />
        <h1 className="title">
          Bible Reading Plan
        </h1>
      </header>
      
      <main className="main">
        <div className="navigation">
          <button
            onClick={() => setWeekIndex(i => Math.max(0, i - 1))}
            disabled={weekIndex === 0}
            className="nav-button"
          >
            Previous
          </button>
          
          <div className="week-display">
            Week of: <span className="week-highlight">{week.date}</span>
          </div>
          
          <button
            onClick={() => setWeekIndex(i => Math.min(planData.length - 1, i + 1))}
            disabled={weekIndex === planData.length - 1}
            className="nav-button"
          >
            Next
          </button>
        </div>
        
        <div className="content">
          <div className="reading-item">
            <span className="reading-label">
              NT Reading
            </span>
            <a 
              href={passageLink(week.nt)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="reading-link"
            >
              {week.nt}
            </a>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">
              OT Connection
            </span>
            <a 
              href={passageLink(week.otConnection)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="reading-link"
            >
              {week.otConnection}
            </a>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">
              OT Reading
            </span>
            <a 
              href={passageLink(week.ot)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="reading-link"
            >
              {week.ot}
            </a>
          </div>
        </div>
        
        <footer className="footer">
          {weekIndex === 0 
            ? 'Reading plan starts September 8, 2025' 
            : `Week ${weekIndex + 1} of ${planData.length}`
          }
        </footer>
      </main>
      
      <footer className="resources-footer">
        <h2 className="resources-title">
          Bible Resources
        </h2>
        <ul className="resources-list">
          {bibleResources.map(resource => (
            <li key={resource.name} className="resource-item">
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resource-link"
              >
                {resource.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="advice">
          Building a habit of reading Scripture takes consistency and prayer. Start small, 
          reflect on what you read, and ask God to guide your understanding. Over time, 
          it will become a cherished part of your daily routine.
        </p>
      </footer>
    </div>
  );
}
