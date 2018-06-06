import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'

import Main from './components/Main'
import Register from './components/Auth/Register'
import EditProfile from './components/screen/EditProfile'
import ShowPromotion from './components/module/ShowPromotion'

export default App = StackNavigator(
  {
    Main: { screen: Main },
    EditProfile: { screen: EditProfile },
    Register: { screen: Register },
    ShowPromotion: { screen: ShowPromotion }
  },
  {
    initialRouteName: 'Main',
  }
)

