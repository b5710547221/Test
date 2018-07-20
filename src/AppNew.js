import React, { Component } from 'react'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import { Root } from 'native-base'

// Auth
import AuthLoadingScreen from './Components/Auth/AuthLoading'
import LoginScreen from './Components/Auth/Login'
 import SignUpScreen from './Components/Auth/SignUp'

//App
import MainScreen from './Components/App/Main'
import ScanScreen from './Components/App/Scan'
import MyWalletScreen from './Components/App/MyWallet'
import EditProfileScreen from './Components/App/EditProfile' 
import ShowGiftPromotionScreen from './Components/module/ShowGiftPromotion'
import ShowPackagePromotionScreen from './Components/module/ShowPackagePromotion'
import ShowWelcomePromotionScreen from './Components/module/ShowWelcomePromotion'
import ShowCollectPromotionScreen from './Components/module/ShowCollectPromotion'
import AddCodeScreen from './Components/module/AddCode'
import ShowQRCodeScreen from './Components/App/ShowQRCode'
import PickProfileImageScreen from './Components/App/PickProfileImage'
import WebViewScreen from './Components/App/WebView'
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
    ShowWelcomePromotion: ShowWelcomePromotionScreen,
    ShowGiftPromotion: ShowGiftPromotionScreen,
    ShowPackagePromotion: ShowPackagePromotionScreen,
    ShowCollectPromotion: ShowCollectPromotionScreen,
    AddCode: AddCodeScreen,
    ShowQRCode: ShowQRCodeScreen,
    PickProfileImage: PickProfileImageScreen,
    WebView: WebViewScreen
})
// const MemberStack = StackNavigator({
//     ShopList: ShopListScreen,
//     Scan: ScanScreen,
//     MyWallet: MyWalletScreen,
// })

const App = createSwitchNavigator(
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

export default () => 
    <Root>
        <App />
    </Root>

