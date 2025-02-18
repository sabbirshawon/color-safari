"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';      
import { Star, Music, Volume2, VolumeX } from 'lucide-react';

const ColorMatchGame = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [targetColor, setTargetColor] = useState('');
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Kid-friendly colors with simple names
  const colors = [
    // Basic Colors
    { name: 'Red', value: '#FF0000', emoji: '🔴' },
    { name: 'Blue', value: '#0000FF', emoji: '🔵' },
    { name: 'Green', value: '#00FF00', emoji: '💚' },
    { name: 'Yellow', value: '#FFFF00', emoji: '💛' },
    { name: 'Purple', value: '#800080', emoji: '💜' },
    { name: 'Orange', value: '#FFA500', emoji: '🟠' },
    
    // Red Shades
    { name: 'Cherry Red', value: '#DC143C', emoji: '🍒' },
    { name: 'Rose Red', value: '#FF007F', emoji: '🌹' },
    { name: 'Ruby Red', value: '#E0115F', emoji: '💎' },
    { name: 'Fire Red', value: '#FF3E3E', emoji: '🔥' },
    { name: 'Strawberry', value: '#FC5A8D', emoji: '🍓' },
    
    // Blue Shades
    { name: 'Sky Blue', value: '#87CEEB', emoji: '🌤' },
    { name: 'Ocean Blue', value: '#000080', emoji: '🌊' },
    { name: 'Baby Blue', value: '#89CFF0', emoji: '👶' },
    { name: 'Royal Blue', value: '#4169E1', emoji: '👑' },
    { name: 'Ice Blue', value: '#A5F2F3', emoji: '🧊' },
    
    // Green Shades
    { name: 'Lime Green', value: '#32CD32', emoji: '🍏' },
    { name: 'Forest Green', value: '#228B22', emoji: '🌲' },
    { name: 'Mint Green', value: '#98FF98', emoji: '🌿' },
    { name: 'Grass Green', value: '#7CBA3D', emoji: '🌱' },
    { name: 'Olive Green', value: '#808000', emoji: '🫒' },
    
    // Yellow Shades
    { name: 'Lemon Yellow', value: '#FFF44F', emoji: '🍋' },
    { name: 'Gold Yellow', value: '#FFD700', emoji: '🌟' },
    { name: 'Banana Yellow', value: '#FFE135', emoji: '🍌' },
    { name: 'Sun Yellow', value: '#FFCC00', emoji: '☀️' },
    { name: 'Honey Yellow', value: '#FDB347', emoji: '🍯' },
    
    // Purple Shades
    { name: 'Grape Purple', value: '#6F2DA8', emoji: '🍇' },
    { name: 'Lavender', value: '#E6E6FA', emoji: '💐' },
    { name: 'Plum Purple', value: '#8E4585', emoji: '🍆' },
    { name: 'Magic Purple', value: '#9932CC', emoji: '🔮' },
    { name: 'Berry Purple', value: '#4E1A3D', emoji: '🫐' },
    
    // Orange Shades
    { name: 'Peach Orange', value: '#FFCBA4', emoji: '🍑' },
    { name: 'Tangerine', value: '#FF8C00', emoji: '🍊' },
    { name: 'Carrot Orange', value: '#FF7F00', emoji: '🥕' },
    { name: 'Sunset Orange', value: '#FD5E53', emoji: '🌅' },
    { name: 'Pumpkin Orange', value: '#FF7518', emoji: '🎃' },
    
    // Brown Shades
    { name: 'Chocolate Brown', value: '#7B3F00', emoji: '🍫' },
    { name: 'Wood Brown', value: '#966F33', emoji: '🪵' },
    { name: 'Coffee Brown', value: '#6F4E37', emoji: '☕' },
    { name: 'Cookie Brown', value: '#987654', emoji: '🍪' },
    { name: 'Bear Brown', value: '#964B00', emoji: '🐻' },
    
    // Pink Shades
    { name: 'Bubble Pink', value: '#FFC0CB', emoji: '🫧' },
    { name: 'Cotton Candy', value: '#FFB7C5', emoji: '🍭' },
    { name: 'Flower Pink', value: '#FF69B4', emoji: '🌸' },
    { name: 'Heart Pink', value: '#FF66CC', emoji: '💗' },
    { name: 'Flamingo Pink', value: '#FF99CC', emoji: '🦩' },
    
    // Gray Shades
    { name: 'Silver Gray', value: '#C0C0C0', emoji: '🥈' },
    { name: 'Storm Gray', value: '#708090', emoji: '⛈' },
    { name: 'Mouse Gray', value: '#808080', emoji: '🐭' },
    { name: 'Rock Gray', value: '#A9A9A9', emoji: '🪨' },
    { name: 'Cloud Gray', value: '#B6B6B4', emoji: '☁️' },
    
    // Special Colors
    { name: 'Rainbow', value: 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)', emoji: '🌈' },
    { name: 'Galaxy', value: 'linear-gradient(to right, #663399, #5B247A)', emoji: '🌌' },
    { name: 'Unicorn', value: 'linear-gradient(to right, #FFB6C1, #FFE4E1)', emoji: '🦄' },
    { name: 'Dragon', value: 'linear-gradient(to right, #50C878, #4B0082)', emoji: '🐲' },
    { name: 'Magic', value: 'linear-gradient(to right, #FF69B4, #FFD700)', emoji: '✨' }
  ];

  // Replace your current sound useEffect with this:
  useEffect(() => {
    const playSound = (type) => {
      if (!soundEnabled) return;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
          // Happy sound for correct answer
          oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1); // A5
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        } else if (type === 'wrong') {
          // Lower sound for wrong answer
          oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
          oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.1); // D4
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        } else if (type === 'celebration') {
          // Special celebratory sound sequence
          const duration = 0.1;
          oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
          oscillator.frequency.setValueAtTime(739.99, audioContext.currentTime + duration); // F#5
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + duration * 2); // A5
          oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + duration * 3); // C6
          oscillator.frequency.setValueAtTime(1318.51, audioContext.currentTime + duration * 4); // E6
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration * 5);
          return;
        }
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      } catch (error) {
        console.log('Sound error:', error);
      }
    };
  
    window.playGameSound = playSound;
  }, [soundEnabled]);

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateOptions = () => {
    const correctColor = getRandomColor();
    const wrongColors = colors
      .filter(c => c.name !== correctColor.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setTargetColor(correctColor);
    setOptions([correctColor, ...wrongColors].sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameOver(false);
    setFeedback(null);
    generateOptions();
    window.playGameSound('correct');
  };

  const handleColorClick = (color) => {
    setSelectedButton(color.name);
    setIsAnimating(true);
    
    const isCorrect = color.name === targetColor.name;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      window.playGameSound('correct');
      setFeedback({
        message: `Yay! That's right! ${color.emoji}`,
        type: 'success'
      });
    } else {
      setStreak(0);
      window.playGameSound('wrong');
      setFeedback({
        message: `Oops! Try again! ${targetColor.emoji}`,
        type: 'error'
      });
    }

    setTimeout(() => {
      setIsAnimating(false);
      setSelectedButton(null);
      if (isCorrect) {
        generateOptions();
      }
    }, 1000);
  };

  useEffect(() => {
    let timer;
    if (gameStarted && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setGameStarted(false);
            setHighScore(current => {
              // Play celebration sound if score is good (e.g., more than 10)
              if (score > 10) {
                window.playGameSound('celebration');
              } else {
                window.playGameSound('correct');
              }
              return Math.max(current, score);
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, score]);

  return (
    <Card className="w-full min-h-screen sm:min-h-0 sm:max-w-2xl mx-auto p-3 sm:p-6 bg-gradient-to-b from-blue-50 to-purple-50">
      <CardContent>
        <div className="text-center space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-purple-600">Color Match!</h1>
                <Button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="rounded-full p-1 sm:p-2"
                    variant="ghost"
                >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </Button>
            </div>

          {!gameStarted && !gameOver && (
            <div className="space-y-4 sm:space-y-6">
                <p className="text-xl sm:text-2xl text-gray-700">Match the colors and win stars! ⭐</p>
                    <Button 
                    onClick={startGame}
                    className="text-xl sm:text-2xl p-4 sm:p-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 transition-transform"
                    >
                    Let's Play! 🎮
                    </Button>
            </div>
          )}

          {gameStarted && (
            <div className="space-y-6">
                <div className="flex justify-between text-xl sm:text-2xl font-bold">
                    <span>⭐ {score}</span>
                    <span>⏰ {timeLeft}s</span>
                </div>

              {feedback && (
                <Alert 
                    className={`text-xl sm:text-2xl font-bold 
                    ${feedback.type === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    } 
                    animate-bounce shadow-lg border-2 
                    ${feedback.type === 'success' ? 'border-green-500' : 'border-red-500'}`}
                >
                    {feedback.message}
                </Alert>
              )}

                <div className="mb-4 sm:mb-8">
                    <div className="mb-4 sm:mb-8 bg-white/80 rounded-lg p-2">
                        <span className="text-2xl sm:text-4xl font-bold block mb-2 sm:mb-4 text-gray-800">
                            Find this color! {targetColor.emoji}
                        </span>
                    </div>
                    <span 
                        className="text-3xl sm:text-5xl font-bold block"
                        style={{ 
                            color: targetColor.value,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',  // Increased shadow
                            WebkitTextStroke: '1px black',  // Add outline for better visibility
                            padding: '10px',
                            backgroundColor: 'rgba(255,255,255,0.1)',  // Slight background for better contrast
                            borderRadius: '8px'
                          }}
                    >
                        {targetColor.name}
                    </span>
                </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {options.map((color, index) => (
                    <Button
                    key={index}
                    onClick={() => handleColorClick(color)}
                    className={`h-24 sm:h-32 text-xl sm:text-2xl font-bold rounded-xl transform transition-all duration-200 ${
                        selectedButton === color.name ? 'scale-95' : 'hover:scale-105'
                    } ${isAnimating && selectedButton === color.name ? 'animate-bounce' : ''}`}
                    style={{ 
                        background: color.value,
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                    >
                    {color.emoji}
                    </Button>
                ))}
                </div>
            </div>
          )}

          {gameOver && (
            <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-600">Game Over!</h2>
                <div className="space-y-2 sm:space-y-4">
                <p className="text-xl sm:text-2xl">You got {score} stars! ⭐</p>
                {score > highScore && (
                    <p className="text-xl sm:text-2xl text-purple-600">New High Score! 🎉</p>
                )}
                </div>
                <Button 
                onClick={startGame}
                className="text-xl sm:text-2xl p-4 sm:p-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 transition-transform"
                >
                Play Again! 🎮
                </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorMatchGame;