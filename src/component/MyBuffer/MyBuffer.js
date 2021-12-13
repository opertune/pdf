import React, { useRef, useState } from "react";
import { Animated, View, StyleSheet, PanResponder, Dimensions, Platform } from "react-native";

export const MyBuffer = (props) => {
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
        { useNativeDriver: false }

      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;
  
  const AnimatedViewStyle = () => {
    if(Platform.OS === 'ios'){
      return {
        transform: [{translateX: pan.x.interpolate({
          inputRange: [props.width-1.31*props.width, props.width-0.70*props.width], // android : [props.width-1.3*props.width, props.width-0.71*props.width]
          outputRange: [props.width-1.31*props.width, props.width-0.70*props.width], // ios : [props.width-1.31*props.width, props.width-0.70*props.width]
          extrapolate: 'clamp'
        })}, {translateY: pan.y.interpolate({
          inputRange: [props.height-0.98*props.height, props.height-0.29*props.height], // android : [props.height-0.93*props.height, props.height-0.29*props.height]
          outputRange: [props.height-0.98*props.height, props.height-0.29*props.height], // ios : [props.height-0.98*props.height, props.height-0.29*props.height]
          extrapolate: 'clamp'
        })}]
      }
    }else if(Platform.OS === 'android'){
      return {
        transform: [{translateX: pan.x.interpolate({
          inputRange: [props.width-1.3*props.width, props.width-0.71*props.width], // android : [props.width-1.3*props.width, props.width-0.71*props.width]
          outputRange: [props.width-1.3*props.width, props.width-0.71*props.width], // ios : [props.width-1.31*props.width, props.width-0.70*props.width]
          extrapolate: 'clamp'
        })}, {translateY: pan.y.interpolate({
          inputRange: [props.height-0.93*props.height, props.height-0.29*props.height], // android : [props.height-0.93*props.height, props.height-0.29*props.height]
          outputRange: [props.height-0.93*props.height, props.height-0.29*props.height], // ios : [props.height-0.98*props.height, props.height-0.29*props.height]
          extrapolate: 'clamp'
        })}]
      }
    }
  }

  return (
    (!props.width && !props.height) ? null :
    <View style={styles.container}>
      <Animated.View
        style={AnimatedViewStyle()}
        {...panResponder.panHandlers}
      >
        <View style={styles.box} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '35%',
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    height: Dimensions.get('window').height / 12,
    width: Dimensions.get('window').width / 3.5,
    backgroundColor: "aqua",
    opacity: 0.3,
    borderRadius: 5,
    borderWidth: 2,
  }
});