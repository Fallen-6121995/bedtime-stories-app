import { FlatList, Image, SectionList, StatusBar, StyleSheet, Text, useColorScheme, View, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from 'react-native-vector-icons/Feather';
import ellipseImage from '../assets/Ellipse.png';
import StoryCard from '../components/StoryCard';
import storiesData from '../common/StoriesData';

function HomeScreen({ navigation }: any) {
  const userName = "Himanshu"
  const isDarkMode = useColorScheme() === 'dark';

  const handleViewAll = (categoryId: string, categoryName: string) => {
    navigation.navigate('category', { categoryId, categoryName });
  };

  return (
    <ScreenWrapper isHome={true}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} translucent={true}
        backgroundColor="transparent" />
      <Image
        source={ellipseImage}
        style={styles.ellipseImg}
        resizeMode="cover"
      />
      <View style={styles.welcomeContainer}>
        <Text style={styles.userName}>{userName},</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={22} color={'#000000'} />
        </View>
      </View>
      <Text style={styles.welcomeMessage}>Welcome Back</Text>
      {/* Stories List */}
      <View style={styles.storiesListContainer}>
        <SectionList
          sections={storiesData.categories.map(cat => ({
            title: cat.name,
            data: [cat.stories]  // each item is array of stories
          }))}
          keyExtractor={(item, index) => index.toString()} // since now item is an array
          renderSectionHeader={({ section: { title } }) => {
            const category = storiesData.categories.find(cat => cat.name === title);
            return (
              <View style={styles.categoryContainer}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                <Pressable onPress={() => handleViewAll(category?.id || '', title)}>
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              </View>
            );
          }}
          renderItem={({ item }) => (
            <FlatList
              data={item}
              horizontal
              keyExtractor={(story) => story.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: story }) => (
                <StoryCard
                  title={story.title}
                  image={story.image}
                  description={story.description}
                />
              )}
            />
          )}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  ellipseImg: {
    position: 'absolute',
    top: -5,
    right: -13,
    width: 180,
    height: 180,
    zIndex: 0,
  },
  welcomeContainer: {
    marginTop: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
    paddingHorizontal:20
  },
  userName: {
    color: "#2ADB7F",
    fontSize: 27,
    fontWeight: "bold"
  },
  welcomeMessage: {
    fontSize: 27,
    fontWeight: "bold",
    paddingHorizontal:20,
    marginBottom:20
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer:{
    display:"flex",
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    marginVertical: 14,
    paddingHorizontal:20,
  },
  viewAllText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ADB7F',
  },
  storiesListContainer: {
    paddingBottom: 125,
    display: "flex",
    flexDirection: "row"
  }
});

export default HomeScreen;