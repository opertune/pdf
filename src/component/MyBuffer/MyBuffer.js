import React, { useCallback, useRef, useState } from "react";
import { Animated, View, StyleSheet, PanResponder, Dimensions, Platform, Image, Button } from "react-native";
import { PinchGestureHandler } from 'react-native-gesture-handler';


export const MyBuffer = (props) => {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState([0, 0])

  const pan = useRef(new Animated.ValueXY(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        //setPosition([e.nativeEvent.locationX.toFixed(2), e.nativeEvent.locationY.toFixed(2)])
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y },
        ],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (e, gestureState) => {
        setPosition([e.nativeEvent.pageX, e.nativeEvent.pageY])
        pan.flattenOffset();
      },
    })
  ).current;

  const AnimatedViewStyle = () => {
    if (Platform.OS === 'ios') {
      return {
        transform: [{
          translateX: pan.x.interpolate({
            inputRange: [33, props.width - 0.295 * props.width],
            outputRange: [33, props.width - 0.295 * props.width],
            extrapolate: 'clamp'
          })
        }, {
          translateY: pan.y.interpolate({
            inputRange: [-8, props.height - 0.215 * props.height],
            outputRange: [-8, props.height - 0.215 * props.height],
            extrapolate: 'clamp'
          })
        }, { rotate: '90deg' }],
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',

      }
    } else if (Platform.OS === 'android') {
      return {
        transform: [{
          translateX: pan.x.interpolate({
            inputRange: [43, props.width - 0.29 * props.width],
            outputRange: [43, props.width - 0.29 * props.width],
            extrapolate: 'clamp'
          })
        }, {
          translateY: pan.y.interpolate({
            inputRange: [12, props.height - 0.245 * props.height],
            outputRange: [12, props.height - 0.245 * props.height],
            extrapolate: 'clamp'
          })
        }, { rotate: '90deg' }],
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }
  }

  const onPinchGestureEvent = (event) => {
    if (event.nativeEvent.scale > 1) {
      setScale(event.nativeEvent.scale)
    } else {
      setScale(1)
    }
  }

  return (
    (!props.width && !props.height) ? null :
      <Animated.View
        style={AnimatedViewStyle()}
        {...panResponder.panHandlers} onTouchEndCapture={() => props.handler(position)}
      >
        <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
          <Animated.Image style={{
            borderColor: 'black',
            borderWidth: 1,
            backgroundColor: '#44FFD180',
            opacity: 1,
            width: Dimensions.get('window').height / 12,
            height: Dimensions.get('window').width / 3.5,
            transform: [{ scale: scale }]
          }} source={{ uri: props.imgUri }} />
        </PinchGestureHandler>
      </Animated.View>
  );
}