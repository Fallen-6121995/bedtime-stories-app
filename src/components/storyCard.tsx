import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface StoryCardProps {
    title: string;
    duration: string;
    backgroundColor: string;
    onPress: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ title, duration, backgroundColor, onPress }) => {
    return (
        <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.9}>
            <Svg width="200" height="170" viewBox="0 0 200 170" style={StyleSheet.absoluteFill}>
                {/* Smooth rounded “house-like” shape */}
                <Path
                    d="M10 50 
             Q100 0 190 50 
             L190 150 
             Q190 165 175 165 
             L25 165 
             Q10 165 10 150 
             Z"
                    fill={backgroundColor}
                />
            </Svg>

            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>

                <View style={styles.durationRow}>
                    <Text style={styles.clock}>🕒</Text>
                    <Text style={styles.duration}>{duration}</Text>
                </View>

                {/* Decorative stars */}
                <Text style={[styles.star, { top: 12, right: 25 }]}>⭐</Text>
                <Text style={[styles.star, { top: 38, right: 55 }]}>⭐</Text>
                <Text style={[styles.star, { bottom: 40, right: 20 }]}>⭐</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: 200,
        height: 170,
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clock: {
        fontSize: 16,
        marginRight: 6,
    },
    duration: {
        color: '#FFF',
        fontSize: 14,
        opacity: 0.9,
    },
    star: {
        position: 'absolute',
        fontSize: 14,
    },
});

export default StoryCard;