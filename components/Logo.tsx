import React from 'react';
import { Image, StyleSheet, ImageSourcePropType } from 'react-native';

import { Images } from '../config';

interface LogoProps {
  uri: ImageSourcePropType;
}

export const Logo: React.FC<LogoProps> = ({ uri }) => {
  return <Image source={uri} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200
  }
});
