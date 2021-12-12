import { values } from "pdf-lib";
import React, { useRef } from "react";
import { Animated, View, StyleSheet, PanResponder, Dimensions } from "react-native";

export const MyBuffer = () => {
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

  return (
    <View style={styles.container}>
      <Animated.View
        style={{transform: [{translateX: pan.x.interpolate({
          inputRange: [-125, Dimensions.get('window').width - (Dimensions.get('window').width / 1.45)],
          outputRange: [-125, Dimensions.get('window').width - (Dimensions.get('window').width / 1.45)],
          extrapolate: 'clamp'
        })}, {translateY: pan.y.interpolate({
          inputRange: [0, Dimensions.get('window').height - (Dimensions.get('window').height / 2.1)],
          outputRange: [0, Dimensions.get('window').height - (Dimensions.get('window').height) / 2.1],
          extrapolate: 'clamp'
        })}]}}
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