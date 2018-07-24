import React, { Component } from 'react'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import { Root } from 'native-base'

// Auth
import AuthLoading from './Components/Auth/AuthLoading'
import Login from './Components/Auth/Login'
 import SignUp from './Components/Auth/SignUp'

//App
import Main from './Components/App/Main'
import Scan from './Components/App/Scan'
import MyWallet from './Components/App/MyWallet'
import EditProfile from './Components/App/EditProfile' 
import ShowGiftPromotion from './Components/module/ShowGiftPromotion'
import ShowPackagePromotion from './Components/module/ShowPackagePromotion'
import ShowWelcomePromotion from './Components/module/ShowWelcomePromotion'
import ShowCollectPromotion from './Components/module/ShowCollectPromotion'
import AddCode from './Components/module/AddCode'
import ShowQRCode from './Components/App/ShowQRCode'

import ResetPassword from './Components/App/ResetPassword'
import ResetSecurityCode from './Components/App/ResetSecurityCode'
// import Main from './Components/Main'

import MapView from './Components/App/MapView'

// const LoginScreen = ''
// const ShopListScreen = ''
// const ScanScreen = ''
// const MyWalletScreen = ''
// const EditProfileScreen = ''

const AuthStack = createStackNavigator({
    Login, SignUp
})
const AppStack = createStackNavigator({
    Main, Scan, EditProfile, ShowWelcomePromotion, ShowWelcomePromotion,
    ShowGiftPromotion, ShowGiftPromotion, ShowPackagePromotion, ShowPackagePromotion,
    ShowCollectPromotion, ShowCollectPromotion, AddCode, ShowQRCode, ShowQRCode, 
    ResetPassword, ResetSecurityCode, MapView
})
// const MemberStack = StackNavigator({
//     ShopList: ShopListScreen,
//     Scan: ScanScreen,
//     MyWallet: MyWalletScreen,
// })

const App = createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        Auth: AuthStack,
        App: AppStack
        // EditProfile: { screen: EditProfile },
        // SignUp: { screen: SignUp },
        // ShowPromotion: { screen: ShowPromotion }
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

