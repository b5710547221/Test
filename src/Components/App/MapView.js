import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import { Container, Content, Button } from 'native-base'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';



import { Bakodo_Color, Loading_Color } from '../../Config'
import Header from '../Common/Header'
import Loading from '../Common/Loading'

import ImageBackIcon from '../../images/left.png'
import Icon from "react-native-vector-icons/Feather"

const hiddenButton = (
    <Button
        style={{ width: 40 }}
        transparent
    >
        <Text></Text>
    </Button>
)

var width = Dimensions.get("window").width;

export default class MapViewer extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            header: {
                leftMenu: null,
                currentPage: "Select Location",
                rightMenu: null
            },
            currentPosition: null,
            markerPosition: this.props.navigation.state.params.markerPosition,
            isLoading: true
        }
        this.navigation = props.navigation
    }

    componentDidMount = async () => {
        await this.setHeader()
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('success: ', position);
                this.setState({
                    currentPosition: {
                        latitude : position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    isLoading: false
                })
            },
            (error) => console.log('error: ', error),
            { enableHighAccuracy: true, timeout: 1000},
        );
    }

    openSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
        .then((place) => {
            console.log(place);
            const newPosition = {
                latitude: place.latitude,
                longitude: place.longitude
            }
            this.setState({
                markerPosition: newPosition
            })
        })
        .catch(error => console.log(error.message));
    }

    onFinish = () => {
        this.navigation.goBack();
    }

    componentWillMount = () => {
        this.navigation.state.params.onToggle();
    }

    componentWillUnmount = () => {
        this.navigation.state.params.onToggle();
    }

    onClearMarker = () => {
        this.setState({
            markerPosition: null
        })
    }

    setHeader = async() => {
        const backButton = (
            <Button
                style={styles['Header_Icon']}
                onPress={() => { this.onFinish() }}
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
        const confirmButton = (
            <Button
                style={styles["Header_Icon"]}
                onPress={this.onConfirm}
                transparent
                disabled={false}
            >
                <Icon name="check" size={20} color="#FDFDFD"/>
            </Button>
        );
        await this.setState({
            header: {
                leftMenu: backButton,
                currentPage: this.state.header.currentPage,
                rightMenu: confirmButton
            }
        })
    }

    onPress = (e) => {
        console.log('Pressddd ', e.nativeEvent)
        // this.navigation.state.params.onMarkerChange(e.nativeEvent.coordinate)
        this.setState({
            markerPosition: e.nativeEvent.coordinate
        })
    }

    onConfirm = () => {
        this.navigation.state.params.onMarkerChange(this.state.markerPosition)
        this.navigation.goBack()
    }

    render() {
        const { leftMenu, currentPage, rightMenu} = this.state.header
        const { currentPosition, isLoading, markerPosition } = this.state
        console.log(this.props.navigation.state.params.markerPosition)
        return (
            <Container style={styles['Container']}>
                <Header
                    leftMenu={leftMenu}
                    titlePage={currentPage}
                    rightMenu={rightMenu}
                />
                { isLoading ? <Loading /> :
                    <View style={{ flex: 1}}>
                        <MapView
                            style = {{ flex: 1}}
                            provider = { PROVIDER_GOOGLE }
                            region={{
                                latitude: markerPosition ? markerPosition.latitude : currentPosition.latitude,
                                longitude: markerPosition ? markerPosition.longitude : currentPosition.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            onPress={(e) => this.onPress(e)}
                            showsUserLocation

                        >
                            { markerPosition == null ? <View></View> :   
                                <Marker
                                    coordinate={markerPosition}
                                    title="title"
                                    description="description"
                                />                
                            }

                        </MapView>
                        <View style={styles["More_Container"]}>
                            <TouchableOpacity
                                style={styles["Card_Button_Small"]}
                                onPress={this.openSearchModal}
                            >
                                <Text style={styles["Card_Button_Text_Small"]}>
                                    Find Places
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles["Card_Button_Small"]}
                                onPress={this.onClearMarker}
                            >
                                <Text style={styles["Card_Button_Text_Small"]}>
                                    Clear
                                </Text>
                            </TouchableOpacity>
                        </View>                            
                    </View>
           
                }
        
            </Container>

        )
    }
}

const styles = StyleSheet.create({
    Card_Button_Small: {
        borderWidth: 1,
        borderColor: Loading_Color,
        backgroundColor: Loading_Color,
        borderRadius: 20,
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginRight: 20,
        alignSelf: "flex-end"
    },
    Card_Button_Text_Small: {
        color: "#FDFDFD",
        fontSize: 14
    },
    More_Container: {
        bottom: 50,
        position:"absolute",
        height: 200,
        width: width,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    Map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
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