import React, { Component } from 'react'
import { StyleSheet, Alert, View, Text, Image, TouchableOpacity, Linking, Platform, BackHandler, AsyncStorage  } from 'react-native'
import { Container, Content, Button } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons';
import call from 'react-native-phone-call'


import StatusBar from '../Common/StatusBar'
import Header from '../Common/Header'
import Carousel from '../Common/Carousel'
import Loading from '../Common/Loading'

import { Bakodo_Color, Loading_Color, apiRequest } from '../../Config'

import ImageBackIcon from '../../images/left.png'
import ImageClockIcon from '../../images/pointicon.png'
import ImagePinIcon from '../../images/pointicon2.png'

const hiddenButton = (
    <Button
        style={{ width: 40 }}
        transparent
    >
        <Text></Text>
    </Button>
)

export default class ShowPromotion extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            header: {
                leftMenu: null,
                currentPage: null,
                rightMenu: null
            },
            isLoading: true,
            Details: {},
            ShopImages: {},
            PromotionImages: {}
        }
    

        this.navigation = props.navigation
        console.log(Bakodo_Color)
    }

    componentDidMount = async () => {
        if (Platform.OS === "android") {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPage);
        }
        await this.setHeader()
        await this.setPromotionData()
    }

    componentWillUnmount = () => {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPage);
        }
    };

    setPromotionData = async() => {
        const { WalletId, BranchId, CampaignTypeId, PromotionId } = this.navigation.state.params.data
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        try {
            const result = await apiRequest(`/getWalletPromotionDetails` + 
            `/${WalletId}/${BranchId}/${CampaignTypeId}/${PromotionId}`, "GET", {}, "customer", userToken, userId);
            if(result['status'] === 200) {
                console.log('heyyyyyy')
                await this.setState({
                    Details: result['data']['Details'],
                    PromotionImages: result['data']['PromotionImages'],
                    ShopImages: result['data']['ShopImages'],
                    isLoading: false
                })
            }
        } catch(error) {
            console.log(error)
            Alert.alert("Error getting Promotion detail!")
        }
    }

    onBackPage = async () => {
        this.navigation.goBack();
    };


    setHeader = () => {
        const { goBack } = this.navigation
        const backButton = (
            <Button
                style={styles['Header_Icon']}
                onPress={() => { goBack() }}
                transparent
            >
                <Image
                    style={{
                        height: 15,
                        width: 15
                    }}
                    source={ImageBackIcon}
                />
                <Text style={styles['Header_Icon_Text']}>Back</Text>
            </Button>
        )
        this.setState({
            header: {
                leftMenu: backButton,
                currentPage: null,
                rightMenu: hiddenButton
            }
        })
    }

    onClaim = () => {
        console.log('Claim Now')
        this.navigation.navigate('AddCode', { 
            data : this.props.navigation.state.params.data,
            Details: this.state.Details,
            PromotionImages: this.state.PromotionImages,
            ShopImages: this.state.ShopImages
        })
    }

    onCallNum = (number) =>  {
        if(number == null || number.trim() == "") {
            return Alert.alert('This shop does not provide phone number')
        }
        const args = {
            number: number, // String value with the number to call
            prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call 
          }
           
          call(args).catch(console.error)
    }

    onLinkIG = (username) => {
        if(username == null || username.trim() == "") {
            return Alert.alert('This shop does not provide instagram account')
        }
        const IG_URL = `https://instagram.com/${username}`
        Linking.canOpenURL(IG_URL).then(supported => {
            if (!supported) {
              console.log('Can\'t handle url: ' + IG_URL);
            } else {
              return Linking.openURL(IG_URL);
            }
          }).catch(err => console.error('An error occurred', err));
    }

    onLinkFB = (facebookId) => {
        if(facebookId == null || facebookId.trim() == "") {
            return Alert.alert('This shop does not provide facebook page')
        }
        const FANPAGE_URL_FOR_APP = `fb://profile/${facebookId}`;
        const FANPAGE_URL_FOR_BROWSER = `https://fb.com/${facebookId}`;
      
        Linking.canOpenURL(FANPAGE_URL_FOR_APP)
          .then(appSupported => {
            if (appSupported) {
              console.log(`Can handle native url: ${FANPAGE_URL_FOR_APP}`);
              return Linking.openURL(FANPAGE_URL_FOR_APP);
            } else {
              console.log(`Can't handle native url ${FANPAGE_URL_FOR_APP} defaulting to web URL ${FANPAGE_URL_FOR_BROWSER}`);
              return Linking.canOpenURL(FANPAGE_URL_FOR_BROWSER).then(
                webSupported => {
                  if (webSupported) {
                    console.log(`Can handle web url: ${FANPAGE_URL_FOR_BROWSER}`);
                    return Linking.openURL(FANPAGE_URL_FOR_BROWSER);
                  }
                  return null;
                }
              );
            }
          })
          .catch(err => console.error("An error occurred", err));        
    }

    mapShopImages = () => {
        const { ShopImages } = this.state
        console.log('state : ', this.state)
        return ShopImages.map(((img) => {
            return `http://worldenergystation.com/barkodo/assets/img/shop/${img['ImageUrl']}`
        }))
    }

    render() {

        const { leftMenu, currentPage, rightMenu } = this.state.header
        const { PromotionName, BranchName, BranchDescription, ExpiredDate, OpenTime } = this.state.Details
        const { isLoading } = this.state
        console.log(leftMenu)
        console.log(BranchName)
        return (
            <Container style={styles['Container']}>
                <StatusBar />
                <Header
                    leftMenu={leftMenu}
                    titlePage={currentPage}
                    rightMenu={rightMenu}
                />
                { isLoading ? <Loading /> :           
                <Content>

                   <View style={styles['Content']}>
                        <Text style={styles['Header']}>{BranchName}</Text>
                        <Text style={styles['SubHeader']}>{PromotionName}</Text>

                        <View style={styles['Carousel']}>
                            <Carousel images={this.mapShopImages()} />
                        </View>

                        <View style={styles['FlexDirection_Row_Last']}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: 15, width: 15, marginRight: 10}}
                                    source={ImageClockIcon}
                                />
                                <Text style={{color: Loading_Color, fontSize: 12}}>{ExpiredDate}</Text>
                            </View>
                            <Text style={{ flex: 1, textAlign: 'right', color: '#737373', fontSize: 12 }}>{OpenTime}</Text>
                        </View>

                        <View style={[styles['FlexDirection_Row'], { maxHeight: 120, paddingHorizontal: 20 }]}>
                            <Text style={styles['Normal_Text']}>{BranchDescription}</Text>
                        </View>

                        <View style={styles['FlexDirection_Row']}>
                            <Image
                                style={{ height: 15, width: 12, marginRight: 10 }}
                                source={ImagePinIcon}
                            />
                            <Text style={[styles['Normal_Text'], {flex: 1}]}>qq dessert of Taiwan, Chatuchak, Bangkok 10900</Text>
                        </View>

                        <View style={styles['FlexDirection_Row']}>
                            <TouchableOpacity
                                onPress={this.onLinkIG.bind(this, 'liverpoolfc')}
                                style={styles['Contract_Container']}>
                                <View style={styles['Contract']}>
                                    <Icon style={styles['Contract_Icon']} name='logo-instagram' size={30} color='#FFFFFF' />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onCallNum.bind(this, '123456789')}
                                style={styles['Contract_Container']}>
                                <View style={styles['Contract']}>
                                    <Icon style={styles['Contract_Icon']} name='ios-call' size={30} color='#FFFFFF' />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onLinkFB.bind(this, '746280992139796')}
                                style={styles['Contract_Container']}>
                                <View style={styles['Contract']}>
                                    <Icon style={styles['Contract_Icon']} name='logo-facebook' size={30} color='#FFFFFF' />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <Button style={styles['Button']} onPress={this.onClaim}>
                            <Text style={styles['Button_Text']}>Claim now</Text>
                        </Button>
                    </View> 
                </Content>
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    Header_Icon: {
        width: 60,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Header_Icon_Text: {
        color: '#FFFFFF',
        paddingLeft: 5
    },
    Container: {
        backgroundColor: Bakodo_Color,
    },
    Content: {
        height: null,
        width: '80%',
        backgroundColor: '#FDFDFD',
        borderRadius: 20,
        marginBottom: 20,
        paddingVertical: 15,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    Header: {
        color: '#6E69CC',
        fontSize: 22,
        textAlign: 'center'
    },
    SubHeader: {
        color: '#737373',
        textAlign: 'center',
        paddingBottom: 15
    },
    Carousel: {
        height: 200
    },
    FlexDirection_Row: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        flexDirection: 'row'
    },
    FlexDirection_Row_Last: {
        padding: 10,
        borderColor: '#CCCCCC',
        flexDirection: 'row'
    }, 
    Contract_Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Contract: {
        height: 40,
        width: 40,
        backgroundColor: '#4D4D4D',
        borderRadius: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    Contract_Icon: {
        paddingTop: Platform.OS === 'ios' ? 3 : 0
    },
    Button: {
        width: '80%',
        backgroundColor: '#6E69CC',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        alignSelf: 'center'
    },
    Button_Text: {
        textAlign: 'center',
        color: '#FFFFFF',
        flex: 1
    },
    Normal_Text: {
        color: '#737373'
    }

})