import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  size: number;
  color: string;
  style?: any; // You can replace 'any' with more specific type if needed
}

export const Icon: React.FC<IconProps> = ({ name, size, color, style }) => {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};
