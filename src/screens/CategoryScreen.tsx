import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import StoryCard from '../components/StoryCard';
import storiesData from '../common/StoriesData';

type CategoryScreenProps = {
  route: {
    params: {
      categoryId: string;
      categoryName: string;
    };
  };
};

function CategoryScreen({ route }: CategoryScreenProps) {
  const { categoryId, categoryName } = route.params;
  
  // Find the category data
  const category = storiesData.categories.find(cat => cat.id === categoryId);
  const stories = category?.stories || [];

  const renderStoryItem = ({ item }: { item: any }) => (
    <View style={styles.storyItem}>
      <StoryCard
        title={item.title}
        image={item.image}
        description={item.description}
        variant="grid"
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.categoryTitle}>{categoryName}</Text>
        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ScreenWrapper>
  );
}

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginTop: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  storyItem: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 16,
  },
});
