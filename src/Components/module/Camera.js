// Camera
import React, { Component } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
} from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import * as NativeBase from 'native-base';
// import PopUp from '../display/Popup';

export default class CameraView extends Component {
	constructor() {
		super();
		this.state = {
			barcode: false,
			firstpopup: false,
			secondpopup: false
		};
		// RNCamera.Constants.FlashMode.off
		this.readQR = this.readQR.bind(this);
	}

	cancelfirstpopup(firstpopup) {
		this.setState({
			firstpopup,
			barcode: false
		});
	}
	okay(firstpopup) {
		this.setState({
			firstpopup,
			secondpopup: true
		});
	}

	more(secondpopup) {
		this.setState({
			secondpopup,
			barcode: false
		});
	}

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      console.log(data.uri);
    }
	};

	readQR(e) {
		console.log(e)
	};

	render() {
		return (
			<View
				// barCodeTypes={[ Camera.constants.BarCodeType.qr ]}
				// onBarCodeRead={(e) => console.log(e)}
				style={styles.container}
				// style={{ flex: 1 }}
				// ref={(cam) => {
				// 	this.camera = cam;
				// }}
				// aspect={Camera.constants.Aspect.fill}
			>
        {/* <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
						style = {styles.preview}
            type={RNCamera.Constants.Type.back}
						onBarCodeRead={(e) => { this.readQR(e) }}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
        /> */}
				<View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
        {/* <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style = {styles.capture}
        >
            <Text style={{fontSize: 14}}>Scan QR</Text>
        </TouchableOpacity> */}
        </View>
				{/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<TouchableOpacity
						style={
							this.state.barcode ? { position: 'absolute', display: 'none' } : { position: 'absolute' }
						}
						onPress={() => this.setState({ barcode: true, firstpopup: true })}
					>
						<Image style={{ width: 204, height: 204 }} source={require('../image/qrcode.png')} />
					</TouchableOpacity>
					<PopUp
						visible={this.state.firstpopup}
						cancel={this.cancelfirstpopup.bind(this)}
						okay={this.okay.bind(this)}
						txt={`You Never have \n qq dessert of Taiwan \n Collect card`}
						txt1={'Open new card ?'}
						btn1={'Okay'}
						btn2={'Cancel'}
					/>
					{this.state.firstpopup === false ? (
						<PopUp
							visible={this.state.secondpopup}
							cancel={this.navigate.bind(this)}
							okay={this.more.bind(this)}
							txt={`ou have earn 1 point from \n qq dessert of Taiwan \n for a total 20 points `}
							txt1={''}
							btn1={'Scan more'}
							btn2={'Go to my wallet'}
						/>
					) : null}
				</View> */}
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});