import React, { Component } from 'react'
import { StyleSheet, Alert, View, Text, Image, TouchableOpacity, AsyncStorage, Platform, BackHandler  } from 'react-native'
import { Container, Content, Button } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons';

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
        const { used } = this.navigation.state.params
        const { WalletId, BranchId, CampaignTypeId, PromotionId } = this.navigation.state.params.data
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        try {
            const url = used ? 
            `/getWalletPromotionDetails` + `/${WalletId}/${BranchId}/${CampaignTypeId}/${PromotionId}` :
            `/getWelcomePromotionAllDetails` + `/${BranchId}/${CampaignTypeId}/${PromotionId}`
            const result = await apiRequest(url, "GET", {}, "customer", userToken, userId);
            
            if(result['status'] === 200) {
                await this.setState({
                    Details: result['data']['Details'],
                    PromotionImages: result['data']['PromotionImages'],
                    ShopImages: result['data']['ShopImages'],
                    isLoading: false
                })
            }
        } catch(error) {
            console.log(error["response"])
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

    onGetPress = () => {
        console.log('On get pressed')
        AsyncStorage.getItem('userId').then((userId) => {
            const params = {
                "userId": userId,
                "branchId": this.navigation.state.params.data.BranchId,
                "promotionId": this.navigation.state.params.data.PromotionId,
                "campaignTypeId": "2"
            }
            this.navigation.state.params.onGet(params)
            this.navigation.goBack()
        })
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
        const { PromotionName, BranchName, BranchDescription, ExpiredDate, EndDate, OpenTime } = this.state.Details
        const { used } = this.navigation.state.params
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
                                    <Text style={{color: Loading_Color, fontSize: 12}}>{used ? ExpiredDate: EndDate}</Text>
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
                                    onPress={() => { Alert.alert('Instagram') }}
                                    style={styles['Contract_Container']}>
                                    <View style={styles['Contract']}>
                                        <Icon style={styles['Contract_Icon']} name='logo-instagram' size={30} color='#FFFFFF' />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { Alert.alert('Phone') }}
                                    style={styles['Contract_Container']}>
                                    <View style={styles['Contract']}>
                                        <Icon style={styles['Contract_Icon']} name='ios-call' size={30} color='#FFFFFF' />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { Alert.alert('Facebook') }}
                                    style={styles['Contract_Container']}>
                                    <View style={styles['Contract']}>
                                        <Icon style={styles['Contract_Icon']} name='logo-facebook' size={30} color='#FFFFFF' />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            { used ? 
                                <View></View> : 
                                <Button style={styles['Button']} onPress={this.onGetPress.bind(this)}>
                                    <Text style={styles['Button_Text']}>Get</Text>
                                </Button>
                            }
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