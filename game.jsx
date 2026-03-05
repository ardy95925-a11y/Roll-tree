import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Lock } from 'lucide-react';

export default function GameOfMastery() {
  const [points, setPoints] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastRoll, setLastRoll] = useState(null);
  const [rollingAnimation, setRollingAnimation] = useState(false);

  // Skill tree state
  const [skills, setSkills] = useState({
    // Tier 1 - Foundation
    'str-1': { id: 'str-1', name: 'Might', tier: 1, category: 'Strength', cost: 10, level: 0, maxLevel: 3, x: 20, y: 20 },
    'int-1': { id: 'int-1', name: 'Intellect', tier: 1, category: 'Intelligence', cost: 10, level: 0, maxLevel: 3, x: 50, y: 20 },
    'dex-1': { id: 'dex-1', name: 'Reflex', tier: 1, category: 'Dexterity', cost: 10, level: 0, maxLevel: 3, x: 80, y: 20 },
    
    // Tier 2 - Power
    'str-2': { id: 'str-2', name: 'Crushing Blow', tier: 2, category: 'Strength', cost: 25, level: 0, maxLevel: 2, x: 20, y: 50, requires: 'str-1' },
    'int-2': { id: 'int-2', name: 'Arcane Insight', tier: 2, category: 'Intelligence', cost: 25, level: 0, maxLevel: 2, x: 50, y: 50, requires: 'int-1' },
    'dex-2': { id: 'dex-2', name: 'Shadow Step', tier: 2, category: 'Dexterity', cost: 25, level: 0, maxLevel: 2, x: 80, y: 50, requires: 'dex-1' },
    
    // Tier 3 - Mastery
    'str-3': { id: 'str-3', name: 'Titan\'s Wrath', tier: 3, category: 'Strength', cost: 50, level: 0, maxLevel: 1, x: 20, y: 80, requires: 'str-2' },
    'int-3': { id: 'int-3', name: 'Reality Warp', tier: 3, category: 'Intelligence', cost: 50, level: 0, maxLevel: 1, x: 50, y: 80, requires: 'int-2' },
    'dex-3': { id: 'dex-3', name: 'Eternal Dance', tier: 3, category: 'Dexterity', cost: 50, level: 0, maxLevel: 1, x: 80, y: 80, requires: 'dex-2' },
    
    // Tier 4 - Ascension
    'asc-1': { id: 'asc-1', name: 'Ascension', tier: 4, category: 'Ultimate', cost: 100, level: 0, maxLevel: 1, x: 50, y: 110, requires: 'str-3', requiresAll: ['int-3', 'dex-3'] },
  });

  const rollDice = () => {
    setRollingAnimation(true);
    const roll = Math.floor(Math.random() * 10) + 1;
    
    setTimeout(() => {
      setLastRoll(roll);
      setPoints(prev => prev + roll * 5); // 5 points per pip
      setRollingAnimation(false);
    }, 600);
  };

  const upgradeSkill = (skillId) => {
    const skill = skills[skillId];
    if (!skill) return;
    
    if (skill.level < skill.maxLevel && points >= skill.cost) {
      // Check requirements
      if (skill.requires) {
        const requiredSkill = skills[skill.requires];
        if (!requiredSkill || requiredSkill.level === 0) return;
      }
      
      if (skill.requiresAll) {
        const allMet = skill.requiresAll.every(reqId => {
          const reqSkill = skills[reqId];
          return reqSkill && reqSkill.level > 0;
        });
        if (!allMet) return;
      }

      setPoints(prev => prev - skill.cost);
      setSkills(prev => ({
        ...prev,
        [skillId]: { ...prev[skillId], level: prev[skillId].level + 1 }
      }));
    }
  };

  const canUpgrade = (skill) => {
    if (skill.level >= skill.maxLevel) return false;
    if (points < skill.cost) return false;
    if (skill.requires) {
      const requiredSkill = skills[skill.requires];
      if (!requiredSkill || requiredSkill.level === 0) return false;
    }
    if (skill.requiresAll) {
      return skill.requiresAll.every(reqId => {
        const reqSkill = skills[reqId];
        return reqSkill && reqSkill.level > 0;
      });
    }
    return true;
  };

  const bookPages = [
    {
      title: 'Strength Path',
      skills: Object.values(skills).filter(s => s.category === 'Strength').sort((a, b) => a.tier - b.tier)
    },
    {
      title: 'Intelligence Path',
      skills: Object.values(skills).filter(s => s.category === 'Intelligence').sort((a, b) => a.tier - b.tier)
    },
    {
      title: 'Dexterity Path',
      skills: Object.values(skills).filter(s => s.category === 'Dexterity').sort((a, b) => a.tier - b.tier)
    },
    {
      title: 'Ultimate Ascension',
      skills: Object.values(skills).filter(s => s.category === 'Ultimate')
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white font-sans overflow-hidden">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }}></div>

      {/* Main Game Area */}
      {!bookOpen && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
          {/* Points Display */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="text-7xl font-light tracking-wider mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {points.toLocaleString()}
            </div>
            <div className="text-slate-400 text-lg font-light tracking-widest uppercase">Points</div>
          </div>

          {/* Dice Roll Button */}
          <div className="mb-20">
            <button
              onClick={rollDice}
              disabled={rollingAnimation}
              className="relative group"
            >
              <div className={`w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-400 rounded-lg shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                rollingAnimation ? 'scale-95 opacity-75' : 'hover:scale-105 hover:shadow-3xl'
              }`}>
                <div className={`text-6xl font-light transition-all ${
                  rollingAnimation ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
                } duration-300`} style={{ color: '#1a1a1a' }}>
                  {lastRoll || '?'}
                </div>
              </div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm font-light tracking-widest uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Roll Dice
              </div>
            </button>
          </div>

          {/* Last Roll Display */}
          {lastRoll && (
            <div className="text-center mb-12 animate-pulse">
              <div className="text-slate-400 text-sm tracking-widest uppercase">Last Roll</div>
              <div className="text-4xl font-light mt-1">+{lastRoll * 5} Points</div>
            </div>
          )}

          {/* Open Book Button */}
          <button
            onClick={() => {
              setBookOpen(true);
              setCurrentPage(0);
            }}
            className="mt-auto px-8 py-3 border border-slate-400 text-slate-300 font-light tracking-widest uppercase text-sm hover:bg-slate-800 hover:border-slate-300 hover:text-white transition-all duration-300"
          >
            Open Book of Mastery
          </button>
        </div>
      )}

      {/* Book of Mastery */}
      {bookOpen && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            {/* Book Container */}
            <div className="relative" style={{ perspective: '1200px' }}>
              {/* Left Page */}
              <div
                className="absolute inset-0 w-1/2 bg-gradient-to-br from-slate-100 to-slate-50 p-8 rounded-lg shadow-2xl"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${currentPage * -180}deg)`,
                  transition: 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="text-slate-900">
                  {currentPage < bookPages.length && (
                    <div className="h-full flex flex-col">
                      <h1 className="text-4xl font-light mb-8 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {bookPages[currentPage].title}
                      </h1>
                      <div className="flex-1 space-y-6 overflow-y-auto">
                        {bookPages[currentPage].skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="p-4 border-l-4 border-slate-300 hover:border-slate-500 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-light">{skill.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 font-light">
                                  {skill.level}/{skill.maxLevel}
                                </span>
                                {skill.level < skill.maxLevel && (
                                  <span className="text-xs bg-slate-300 text-slate-900 px-2 py-1 rounded font-light">
                                    {skill.cost} pts
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Level Indicators */}
                            <div className="flex gap-1 mb-3">
                              {Array(skill.maxLevel).fill(0).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                                    i < skill.level ? 'bg-slate-700' : 'bg-slate-300'
                                  }`}
                                ></div>
                              ))}
                            </div>

                            {/* Upgrade Button */}
                            <button
                              onClick={() => upgradeSkill(skill.id)}
                              disabled={!canUpgrade(skill)}
                              className={`w-full py-2 text-sm font-light tracking-wider uppercase transition-all ${
                                canUpgrade(skill)
                                  ? 'bg-slate-700 hover:bg-slate-800 text-white cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {skill.level >= skill.maxLevel ? 'Mastered' : 'Upgrade'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Page (flipped version) */}
              <div
                className="absolute inset-0 left-1/2 w-1/2 bg-gradient-to-br from-slate-100 to-slate-50 p-8 rounded-lg shadow-2xl"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${currentPage * -180 + 180}deg)`,
                  transition: 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  backfaceVisibility: 'hidden',
                  transformOrigin: 'left center',
                }}
              >
                <div className="text-slate-900">
                  {currentPage + 1 < bookPages.length && (
                    <div className="h-full flex flex-col">
                      <h1 className="text-4xl font-light mb-8 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {bookPages[currentPage + 1].title}
                      </h1>
                      <div className="flex-1 space-y-6 overflow-y-auto">
                        {bookPages[currentPage + 1].skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="p-4 border-l-4 border-slate-300 hover:border-slate-500 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-light">{skill.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 font-light">
                                  {skill.level}/{skill.maxLevel}
                                </span>
                                {skill.level < skill.maxLevel && (
                                  <span className="text-xs bg-slate-300 text-slate-900 px-2 py-1 rounded font-light">
                                    {skill.cost} pts
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-1 mb-3">
                              {Array(skill.maxLevel).fill(0).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                                    i < skill.level ? 'bg-slate-700' : 'bg-slate-300'
                                  }`}
                                ></div>
                              ))}
                            </div>

                            <button
                              onClick={() => upgradeSkill(skill.id)}
                              disabled={!canUpgrade(skill)}
                              className={`w-full py-2 text-sm font-light tracking-wider uppercase transition-all ${
                                canUpgrade(skill)
                                  ? 'bg-slate-700 hover:bg-slate-800 text-white cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {skill.level >= skill.maxLevel ? 'Mastered' : 'Upgrade'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-12">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={32} />
              </button>

              <div className="flex gap-2">
                {bookPages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      Math.floor(i / 2) === Math.floor(currentPage / 2)
                        ? 'bg-white w-8'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  ></button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(bookPages.length - 2, currentPage + 1))}
                disabled={currentPage >= bookPages.length - 1}
                className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Close Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => setBookOpen(false)}
                className="px-6 py-2 border border-slate-400 text-slate-300 font-light tracking-widest uppercase text-sm hover:bg-slate-800 hover:border-slate-300 hover:text-white transition-all duration-300"
              >
                Close Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
        }

        /* Smooth scrolling for book pages */
        div::-webkit-scrollbar {
          width: 4px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}