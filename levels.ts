import { LevelData } from './types';

export const levels: LevelData[] = [
  // Level 1 - Tutorial level
  {
    platforms: [
      { x: 0, y: 450, width: 300, height: 50 },
      { x: 350, y: 450, width: 300, height: 50 },
      { x: 700, y: 450, width: 100, height: 50 },
      { x: 150, y: 350, width: 100, height: 20 },
      { x: 300, y: 300, width: 150, height: 20 },
      { x: 500, y: 250, width: 100, height: 20 },
      { x: 650, y: 350, width: 100, height: 20 },
    ],
    coins: [
      { x: 200, y: 320 },
      { x: 350, y: 270 },
      { x: 550, y: 220 },
      { x: 700, y: 320 },
    ],
    enemies: [
      { x: 400, y: 270, leftBound: 300, rightBound: 450 },
    ],
    playerStart: { x: 50, y: 300 },
    exit: { x: 750, y: 400, width: 50, height: 50 }
  },
  
  // Level 2 - More complex platforming
  {
    platforms: [
      { x: 0, y: 450, width: 200, height: 50 },
      { x: 250, y: 400, width: 100, height: 20 },
      { x: 400, y: 350, width: 100, height: 20 },
      { x: 550, y: 300, width: 100, height: 20 },
      { x: 700, y: 250, width: 100, height: 20 },
      { x: 550, y: 200, width: 100, height: 20 },
      { x: 400, y: 150, width: 100, height: 20 },
      { x: 250, y: 200, width: 100, height: 20 },
      { x: 100, y: 250, width: 100, height: 20 },
      { x: 0, y: 200, width: 50, height: 20 },
      // Add invisible floor to prevent falling through the world
      { x: 0, y: 500, width: 800, height: 20 },
    ],
    coins: [
      { x: 275, y: 370 },
      { x: 425, y: 320 },
      { x: 575, y: 270 },
      { x: 725, y: 220 },
      { x: 575, y: 170 },
      { x: 425, y: 120 },
      { x: 275, y: 170 },
      { x: 125, y: 220 },
    ],
    enemies: [
      { x: 300, y: 370, leftBound: 250, rightBound: 350 },
      { x: 450, y: 320, leftBound: 400, rightBound: 500 },
      { x: 600, y: 270, leftBound: 550, rightBound: 650 },
    ],
    playerStart: { x: 50, y: 400 },
    exit: { x: 0, y: 150, width: 50, height: 50 }
  },
  
  // Level 3 - Challenging level
  {
    platforms: [
      { x: 0, y: 450, width: 100, height: 50 },
      { x: 150, y: 450, width: 50, height: 20 },
      { x: 250, y: 400, width: 50, height: 20 },
      { x: 350, y: 350, width: 50, height: 20 },
      { x: 450, y: 300, width: 50, height: 20 },
      { x: 550, y: 250, width: 50, height: 20 },
      { x: 650, y: 200, width: 50, height: 20 },
      { x: 750, y: 150, width: 50, height: 20 },
      { x: 650, y: 100, width: 50, height: 20 },
      { x: 550, y: 150, width: 50, height: 20 },
      { x: 450, y: 200, width: 50, height: 20 },
      { x: 350, y: 250, width: 50, height: 20 },
      { x: 250, y: 300, width: 50, height: 20 },
      { x: 150, y: 350, width: 50, height: 20 },
      { x: 50, y: 300, width: 50, height: 20 },
      { x: 0, y: 250, width: 50, height: 20 },
      { x: 50, y: 200, width: 50, height: 20 },
      { x: 150, y: 150, width: 50, height: 20 },
      { x: 250, y: 100, width: 50, height: 20 },
      { x: 350, y: 50, width: 300, height: 20 },
      // Add invisible floor to prevent falling through the world
      { x: 0, y: 500, width: 800, height: 20 },
    ],
    coins: [
      { x: 175, y: 420 },
      { x: 275, y: 370 },
      { x: 375, y: 320 },
      { x: 475, y: 270 },
      { x: 575, y: 220 },
      { x: 675, y: 170 },
      { x: 675, y: 70 },
      { x: 575, y: 120 },
      { x: 475, y: 170 },
      { x: 375, y: 220 },
      { x: 275, y: 270 },
      { x: 175, y: 320 },
      { x: 75, y: 270 },
      { x: 25, y: 220 },
      { x: 75, y: 170 },
      { x: 175, y: 120 },
      { x: 275, y: 70 },
    ],
    enemies: [
      { x: 175, y: 420, leftBound: 150, rightBound: 200 },
      { x: 375, y: 320, leftBound: 350, rightBound: 400 },
      { x: 575, y: 220, leftBound: 550, rightBound: 600 },
      { x: 475, y: 170, leftBound: 450, rightBound: 500 },
      { x: 275, y: 270, leftBound: 250, rightBound: 300 },
      { x: 75, y: 170, leftBound: 50, rightBound: 100 },
    ],
    playerStart: { x: 50, y: 400 },
    exit: { x: 500, y: 0, width: 50, height: 50 }
  }
];