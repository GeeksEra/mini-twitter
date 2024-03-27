import React from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';

import { Colors } from '../config';

interface FormErrorMessageProps {
  error: string;
  visible: boolean;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ error, visible }) => {
  if (!error || !visible) {
    return null;
  }

  return <Text style={styles.errorText}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    marginLeft: 15,
    color: Colors.red,
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '600'
  }
});
