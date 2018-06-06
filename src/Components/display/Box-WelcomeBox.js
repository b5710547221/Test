import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Platform } from 'react-native'

import { Bakodo_Color } from '../../Config'

import ImageLogo from '../../images/logo2.png'

export default class WelcomeBox extends Component {
  render() {
    return (
      <View style={styles['Container']} >
        <View style={styles['SubContainer']} >
          <Text style={styles['Welcome']} >Welcome to</Text>
          <Image style={styles['Image']} source={ImageLogo} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Container: {
    height: 90,
    width: null,
    backgroundColor: Bakodo_Color
  },
  SubContainer: {
    alignItems: 'center'
  },
  Welcome: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: Platform.OS === 'ios' ? '6%' : '3%',
    marginBottom: Platform.OS === 'ios' ? '2%' : '3%',
  },
  Image: {
    height: 23,
    width: 126
  }
})
