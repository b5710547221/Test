import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View, 
Image, Alert, AsyncStorage, Platform, BackHandler  } from 'react-native'
import { Container, Content, Button } from 'native-base'
import Svg, { Circle }from 'react-native-svg';
import { SafeAreaView } from 'react-navigation'

import { Bakodo_Color, Loading_Color, apiRequest } from '../../Config'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import StatusBar from '../Common/StatusBar'
import Carousel from '../Common/Carousel'

import ImageBackIcon from '../../images/left.png'

const hiddenButton = (
    <Button
        style={{ width: 40 }}
        transparent
    >
        <Text></Text>
    </Button>
)

const hiddenPass = (
    <Svg height="16" width="16">
        <Circle cx="8" cy="8" r="8" fill = {Loading_Color} />
    </Svg>
)

export default class AddCode extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            isPassCode: '',
            header: {
                leftMenu: null,
                currentPage: null,
                rightMenu: null
            }
        }

        this.navigation = props.navigation
    }

    componentDidMount = async () => {
        if (Platform.OS === "android") {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPage);
        }
        await this.setHeader()
    }

    componentWillUnmount = () => {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPage);
        }
    };

    onBackPage = async () => {
        this.navigation.goBack();
    };


    enterPassCode = async (text) => {
        if (text.length <= 4) {
            await this.setState({
                isPassCode: text
            })
        }
    }

    setHeader = async() => {
        console.log('header is set in AddCode')
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
        await this.setState({
            header: {
                leftMenu: backButton,
                currentPage: null,
                rightMenu: hiddenButton
            }
        })
    }

    onRedeem = async() => {
        const { CampaignTypeId, PromotionId } = this.navigation.state.params.data;
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        if(this.state.isPassCode === '1234') {

            try {
                const resultGetCode = await apiRequest(`/getRedeemQRCodePromotions/${CampaignTypeId}/${PromotionId}`, 'GET', {}, 
                 "customer", userToken, userId);                
                if(resultGetCode['status'] === 201) {
                    console.log(resultGetCode)
                    this.navigation.navigate('ShowQRCode', {
                        data : this.navigation.state.params.data,
                        code : resultGetCode['data']['redeemCode']
                    })  
                } else {
                    console.log(resultGetCode);
                    Alert.alert(resultGetCode['data']['message'])
                }                
            } catch(err) {
                console.log('error: ', err['response']);
                Alert.alert(err["response"]["data"]["message"])
            }
        } else {
            Alert.alert('Wrong Pin!')
        }

    }

    render() {
        const { leftMenu, currentPage, rightMenu } = this.state.header
        const { PromotionName, BranchName, Description, ExpiredDate, PromotionImage, CampaignTypeId } = this.navigation.state.params.data
        const reward = this.navigation.state.params.reward
        let imgUrl = "http://worldenergystation.com/barkodo/assets/img"
        if(PromotionImage) {
            switch(CampaignTypeId) {
                case '1': imgUrl += "/gift_promotion/" + PromotionImage
                    break
                case '2': imgUrl += "/welcome_promotion/" + PromotionImage
                    break
                case '3': imgUrl += "/package_promotion/" + PromotionImage
                    break
                case '4': imgUrl += "/collect_promotion/" + PromotionImage
                    break
            }
        }
        const { isPassCode } = this.state
        console.log('Add Code', this.navigation.state.params.data)
        return (
            <Container style={styles['Container']}>
                <StatusBar />
                <Header
                    leftMenu={leftMenu}
                    titlePage={currentPage}
                    rightMenu={rightMenu}
                />
                <Content>
                    <View style={styles['Content']}>
                        <Text style={styles['Header']}>{BranchName}</Text>
                        <Text style={styles['SubHeader']}>{reward ? reward.desc : PromotionName}</Text>
                        <View style={styles['Carousel']}>
                            <Carousel images={[imgUrl]}/>
                        </View>
                        <View style={styles['AddCode_Container']}>
                            <Text style={styles['AddCode_Text']}>Add your code for redeem</Text>
                            <View style={styles['AddCode_PassCode']} >
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[0] ? hiddenPass : ''}</Text>
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[1] ? hiddenPass : ''}</Text>
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[2] ? hiddenPass : ''}</Text>
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[3] ? hiddenPass : ''}</Text>
                                <TextInput
                                    value={isPassCode}
                                    onChangeText={(text) => { this.enterPassCode(text) }}
                                    maxLength={4}
                                    keyboardType='numeric'
                                    style={styles['AddCode_Input']}
                                />
                            </View>                        
                        </View>

                        <Button style={styles['Button']} onPress={this.onRedeem}>
                            <Text style={styles['Button_Text']}>Redeem</Text>
                        </Button>
                    </View>
                </Content>
            </Container>


        )
    }
}

const styles = StyleSheet.create({
    Carousel: {
        height: 200
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
        backgroundColor: Bakodo_Color
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
    AddCode_Container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    AddCode_Text: {
        color: '#737373',
        fontSize: 18,
        fontWeight: 'bold'
    },
    AddCode_PassCode: {
        height: 50,
        width: '60%',
        borderBottomWidth: 1,
        borderColor: '#6E69CC',
        marginVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    AddCode_PassCode_Text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        color: Loading_Color,
        flex: 1,
    },
    AddCode_Input: {
        color: '#FFFFFF',
        width: '100%',
        opacity: 0,
        position: 'absolute'
    },
    AddCode_Button: {
        width: '80%',
        backgroundColor: '#F27261',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center'
    },
    AddCode_Button_Text: {
        color: '#FFFFFF'
    },
    Button: {
        width: '80%',
        backgroundColor: Loading_Color,
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
})