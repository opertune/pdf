import React, { useCallback, useRef, useState } from "react";
import { Animated, View, StyleSheet, PanResponder, Dimensions, Platform, Image } from "react-native";
import { PinchGestureHandler } from 'react-native-gesture-handler';


export const MyBuffer = (props) => {
  const [scale, setScale] = useState(1)

  const pan = useRef(new Animated.ValueXY(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        //ref.current = [{posx:pan.x._value,posy: pan.y._value}]
        //console.log('x: ', pan.x._value,' y: ',pan.y._value)
      }
    })
  ).current;

  const AnimatedViewStyle = () => {
    if (Platform.OS === 'ios') {
      return {
        transform: [{
          translateX: pan.x.interpolate({
            inputRange: [props.width - 1.30 * props.width, props.width - 0.60 * props.width],
            outputRange: [props.width - 1.30 * props.width, props.width - 0.60 * props.width],
            extrapolate: 'clamp'
          })
        }, {
          translateY: pan.y.interpolate({
            inputRange: [props.height - 1.035 * props.height, props.height - 0.245 * props.height],
            outputRange: [props.height - 1.035 * props.height, props.height - 0.245 * props.height],
            extrapolate: 'clamp'
          })
        }]
      }
    } else if (Platform.OS === 'android') {
      return {
        transform: [{
          translateX: pan.x.interpolate({
            inputRange: [props.width - 1.28 * props.width, props.width - 0.59 * props.width],
            outputRange: [props.width - 1.28 * props.width, props.width - 0.59 * props.width],
            extrapolate: 'clamp'
          })
        }, {
          translateY: pan.y.interpolate({
            inputRange: [props.height - 1.045 * props.height, props.height - 0.245 * props.height],
            outputRange: [props.height - 1.045 * props.height, props.height - 0.245 * props.height],
            extrapolate: 'clamp'
          })
        }]
      }
    }
  }

  const onPinchGestureEvent = (event) => {
    if(event.nativeEvent.scale > 1){
      setScale(event.nativeEvent.scale)
    }else{
      setScale(1)
    }
  }

  return (
    (!props.width && !props.height) ? null :
      <View style={styles.container}>
        <Animated.View
          style={AnimatedViewStyle()}
          {...panResponder.panHandlers} onTouchEnd={() => props.handler([pan.x, pan.y])}
        >
          <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
            <Animated.Image style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  backgroundColor: '#44FFD180',
                  opacity: 1,
                  width: Dimensions.get('window').height / 12,
                  height: Dimensions.get('window').width / 3.5,
                  resizeMode: 'contain',
                  transform: [{rotate: '90deg'}, {scale: scale}]
            }} source={{ uri: props.imgUri }} />
          </PinchGestureHandler>
        </Animated.View>
      </View >
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '35%',
    alignItems: "center",
    justifyContent: "center"
  }
});