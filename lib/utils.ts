import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAccessType = (userType: UserType) => {
  const accessMap = {
    creator: ['room:write'],
    editor: ['room:write'],
    viewer: ['room:read', 'room:presence:write'],
  };
  return accessMap[userType] || ['room:read', 'room:presence:write'];
};

export const dateConverter = (timestamp: string): string => {
  const diffInSeconds = (new Date().getTime() - new Date(timestamp).getTime()) / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  if (diffInDays > 7) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays >= 1) return `${Math.floor(diffInDays)} days ago`;
  if (diffInHours >= 1) return `${Math.floor(diffInHours)} hours ago`;
  if (diffInMinutes >= 1) return `${Math.floor(diffInMinutes)} minutes ago`;
  return 'Just now';
};

export const getRandomColor = () => {
  const avoidColors = ['#000000', '#FFFFFF', '#8B4513'];
  let randomColor;
  do {
    randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  } while (avoidColors.includes(randomColor));
  return randomColor;
};

export const brightColors = [
  '#2E8B57',
  '#FF6EB4',
  '#00CDCD',
  '#FF00FF',
  '#FF007F',
  '#FFD700',
  '#00CED1',
  '#FF1493',
  '#00CED1',
  '#FF7F50',
  '#9ACD32',
  '#FFA500',
  '#32CD32',
  '#ADFF2F',
  '#DB7093',
  '#00FF7F',
  '#FFD700',
  '#FF007F',
  '#FF6347',
];

export function getUserColor(userId: string) {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }

  const colorIndex = sum % brightColors.length;
  return brightColors[colorIndex];
}
