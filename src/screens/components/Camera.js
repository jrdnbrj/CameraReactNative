import React, { useState, useRef } from 'react'
import {
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    ImageBackground,
    Text,
    StatusBar,
    TouchableWithoutFeedback
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import Video from 'react-native-video'

const Camera = () => {

    const [image, setImage] = useState('')
    const [video, setVideo] = useState('')
    const [recording, setRecording] = useState(false)
    const [frontCamera, setFrontCamera] = useState('')
    const camera = useRef(RNCamera)
    const videoCamera = useRef(Video)

    const takePicture = async () => {
        if (camera) {
            const options = { quality: 0.5, base64: true }
            const data = await camera.current.takePictureAsync(options)
            setImage(data.base64)
        }
    }

    const startRecording = async () => {
        setRecording(true)
        const data = await camera.current.recordAsync();
        console.log('data.uri:', data)
        setVideo(data.uri)
    }

    const stopRecording = () => {
        camera.current.stopRecording()
        setRecording(false)
    }

    const changeCamera = () => {
        if (frontCamera) setFrontCamera(false)
        else setFrontCamera(true)
    }
    const clear = () => {
        setImage('')
        setVideo('')
        // setRecording(false)
    } 
    return (
        <>
            <StatusBar hidden />
            {
                image ? 
                <ImageBackground source={{ uri: 'data:image/png;base64,' + image, isStatic: true }} style={ style.image }>
                    <View style={ style.x }>
                        <TouchableOpacity onPress={clear} style={style.captureX}>
                            <Text style={style.text}>X</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground> :
                video ?
                <>
                    <Video 
                        source={{ uri: video }}
                        ref={videoCamera}
                        style={style.video}
                    /> 
                    <View style={ style.x }>
                        <TouchableOpacity onPress={clear} style={style.captureX}>
                            <Text style={style.text}>X</Text>
                        </TouchableOpacity>
                    </View>
                </>
                    :
                <RNCamera 
                    style={ style.preview } 
                    type={ frontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back }
                    ref={ camera }
                    captureAudio={ true }
                    // pendingAuthorizationView={ null }
                >
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                        {
                            recording ?
                            <TouchableOpacity onPress={ stopRecording.bind(this) } style={ style.captureVideoStop } >
                                <Text style={{ fontSize: 30, color: 'white' }}>ll</Text>
                            </TouchableOpacity> :
                            <>
                                <TouchableOpacity onPress={ startRecording.bind(this) } style={ style.captureVideo } />
                                <TouchableOpacity onPress={ takePicture.bind(this) } style={ style.capture } />
                                <TouchableOpacity onPress={ changeCamera } style={ style.capture2 } />
                            </>
                        }
                        
                    </View>
                </RNCamera>
            }
        </>
    )
}

export default Camera;

let { height, width } = Dimensions.get('window');

const style = StyleSheet.create({
    preview: {  
        flex: 0,
        justifyContent: 'flex-end',  
        height: height,  
        width: width
    },
    capture: {
        flex: 0,
        borderColor: 'white',
        borderWidth: 3,
        borderRadius: 100,
        paddingVertical: 30,
        paddingHorizontal: 30,
        margin: 20,
    },
    captureVideo: {
        flex: 0,
        backgroundColor: 'red',
        borderColor: 'white',
        borderWidth: 3,
        borderRadius: 100,
        paddingVertical: 30,
        paddingHorizontal: 20,
        margin: 20,
    },
    video: {
        height,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    captureVideoStop: {
        flex: 0,
        backgroundColor: 'red',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100,
        paddingVertical: 10,
        paddingHorizontal: 23,
        margin: 20,
    },
    capture2: {
        flex: 0,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 10,
        margin: 30,
    },
    image: { 
        flex: 1,
        width: width, 
        height: height
    },
    x: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    captureX: {
        borderRadius: 100,
        paddingVertical: 0,
        paddingHorizontal: 8,
        margin: 10,
        backgroundColor: 'white'
    },
    text: {
        fontSize: 20,
        color: 'gray',
        fontWeight: 'bold'
    }
});