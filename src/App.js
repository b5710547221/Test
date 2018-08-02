import React, { Component } from 'react'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import { Root } from 'native-base'

// Auth
import AuthLoading from './Components/Auth/AuthLoading'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'

//App
import Main from './Components/App/Main'
import EditProfile from './Components/App/EditProfile' 
import ShowGiftPromotion from './Components/App/ShowGiftPromotion'
import ShowPackagePromotion from './Components/App/ShowPackagePromotion'
import ShowWelcomePromotion from './Components/App/ShowWelcomePromotion'
import ShowCollectPromotion from './Components/App/ShowCollectPromotion'
import AddCode from './Components/App/AddCode'
import ShowQRCode from './Components/App/ShowQRCode'

import ResetPassword from './Components/App/ResetPassword'
import ResetSecurityCode from './Components/App/ResetSecurityCode'

import MapView from './Components/App/MapView'

const AuthStack = createStackNavigator({
    Login, SignUp
})
const AppStack = createStackNavigator({
    Main, EditProfile, ShowWelcomePromotion, ShowWelcomePromotion,
    ShowGiftPromotion, ShowGiftPromotion, ShowPackagePromotion, ShowPackagePromotion,
    ShowCollectPromotion, ShowCollectPromotion, AddCode, ShowQRCode, ShowQRCode, 
    ResetPassword, ResetSecurityCode, MapView
})

const App = createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        Auth: AuthStack,
        App: AppStack
    },
    {
        initialRouteName: 'AuthLoading',
        navigationOptions: {
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          },
    }
)

export default () => 
    <Root>
        <App />
    </Root>

