import React, { useCallback, ReactNode } from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { Colors } from '../config';

interface ButtonProps {
  children?: ReactNode;
  onPress: () => void;
  activeOpacity?: number;
  borderless?: boolean;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  activeOpacity = 0.3,
  borderless = false,
  title,
  style
}) => {
  const _style = useCallback(({ pressed }) => [
    style,
    { opacity: pressed ? activeOpacity : 1 }
  ], [activeOpacity, style]);

  if (borderless) {
    return (
      <Pressable onPress={onPress} style={_style}>
        <Text style={styles.borderlessButtonText}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={_style}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  borderlessButtonText: {
    fontSize: 16,
    color: Colors.blue
  }
});

