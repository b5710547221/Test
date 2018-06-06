import React, { Component } from 'react'
import { View, Image, StyleSheet } from 'react-native';

import ImageSplachScreen from '../../images/logo.png'

export default class SplashScreen extends Component {
  render() {
    return (
      <View style={styles['Container']} >
        <Image style={styles['Image']} source={ImageSplachScreen} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  Image: {
    height: 290,
    width: 270
  }
})

