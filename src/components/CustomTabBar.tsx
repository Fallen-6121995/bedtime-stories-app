import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PrimaryGradient } from '../constants/gradients';

const { width } = Dimensions.get('window');

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('home')}
        style={styles.tab}
      >
        <Icon
          name="home-outline"
          size={24}
          color={state.index === 0 ? '#A020F0' : '#999'}
        />
        <Text style={[styles.label, { color: state.index === 0 ? '#A020F0' : '#999' }]}>
          Home
        </Text>
      </TouchableOpacity>

      <PrimaryGradient style={styles.fab}>
        <TouchableOpacity
          onPress={() => navigation.navigate('generate')}
        >
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </PrimaryGradient>

      <TouchableOpacity
        onPress={() => navigation.navigate('profile')}
        style={styles.tab}
      >
        <Icon
          name="person-outline"
          size={24}
          color={state.index === 1 ? '#A020F0' : '#999'}
        />
        <Text style={[styles.label, { color: state.index === 1 ? '#A020F0' : '#999' }]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: -5 },
    // shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 3,
  },
  fab: {
    position: 'absolute',
    top: -30,
    left: width / 2 - 30,
    // backgroundColor: '#A020F0',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});