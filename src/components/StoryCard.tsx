import { Image, ImageSourcePropType, StyleSheet, Text, View, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import React from 'react'

type StoryCardProps = {
    image: string;
    title: string;
    description: string;
    variant?: 'horizontal' | 'grid';
};

const StoryCard: React.FC<StoryCardProps> = ({ image, title, description, variant = 'horizontal' }) => {
    return (
            <View style={[
                styles.storyImageContainer,
                variant === 'grid' && styles.gridVariant
            ]}>
                <Image
                    source={{ uri: image }}
                    style={styles.storyImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    locations={[0.5, 1]}
                    style={styles.gradientOverlay}
                />
                <View style={styles.storyTextOverlay}>
                    <Text style={[
                        styles.title,
                        variant === 'grid' && styles.gridTitle
                    ]}>{title}</Text>
                    <Text numberOfLines={2} style={[
                        styles.description,
                        variant === 'grid' && styles.gridDescription
                    ]}>{description}</Text>
                </View>
            </View>
    )
}

export default StoryCard

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    storyImageContainer: {
        position: "relative",
        width: 227,
        height: 267,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 25,
        marginLeft: 20
    },
    gridVariant: {
        width: (width - 60) / 2, // 2 columns with padding and margins
        height: 200,
        borderRadius: 16,
        marginLeft: 0,
        marginBottom: 16,
    },
    storyImage: {
        width: "100%",
        height: "100%",
    },
    gradientOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    storyTextOverlay: {
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 10,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
    gridTitle: {
        fontSize: 14,
        marginBottom: 4,
    },
    description: {
        color: "#fff"
    },
    gridDescription: {
        fontSize: 12,
        lineHeight: 16,
    }
})  