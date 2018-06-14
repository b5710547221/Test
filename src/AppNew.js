import React, { Component } from 'react'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'

// Auth
import AuthLoadingScreen from './Components/Auth/AuthLoading'
import LoginScreen from './Components/Auth/Login'
 import SignUpScreen from './Components/Auth/SignUp'

//App
import MainScreen from './Components/App/Main'
import ScanScreen from './Components/App/Scan'
// import MyWalletScreen from './Components/App/MyWallet'
import EditProfileScreen from './Components/screen/EditProfile' 
import ShowPromotionScreen from './Components/module/ShowPromotion'
import AddCodeScreen from './Components/module/AddCode'
import ShowQRCodeScreen from './Components/App/ShowQRCode'
import Main from './Components/Main'

// const LoginScreen = ''
// const ShopListScreen = ''
// const ScanScreen = ''
// const MyWalletScreen = ''
// const EditProfileScreen = ''

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    SignUp: SignUpScreen
})
const AppStack = createStackNavigator({
    Main: MainScreen,
    Scan: ScanScreen,
    // MyWallet: MyWalletScreen,
    EditProfile: EditProfileScreen,
    ShowPromotion: ShowPromotionScreen,
    AddCode: AddCodeScreen,
    ShowQRCode: ShowQRCodeScreen
})
// const MemberStack = StackNavigator({
//     ShopList: ShopListScreen,
//     Scan: ScanScreen,
//     MyWallet: MyWalletScreen,
// })

export default App = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
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

