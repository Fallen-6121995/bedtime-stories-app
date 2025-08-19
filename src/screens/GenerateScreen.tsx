import { StyleSheet, Text, TextInput, View, Modal, Pressable, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import PrimaryButton from '../components/PrimaryButton'

function GenerateScreen() {
  const [storyTitle,setStoryTitle] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [isGenreOpen, setIsGenreOpen] = useState<boolean>(false);
  const [wordLimit, setWordLimit] = useState<number>(100);
  const [wordLimitText, setWordLimitText] = useState<string>('100');

  const genres: string[] = [
    'Adventure',
    'Fantasy',
    'Fairy Tale',
    'Mystery',
    'Sci‑Fi',
    'Animals',
    'Bedtime',
    'Educational',
  ];
  const handleStoryTitleChange = (text: string) =>{
    const trimmed = text.trimStart();
    setStoryTitle(trimmed);
  }
  const handleWordLimitChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setWordLimitText(digitsOnly);
  }
  const handleWordLimitBlur = () => {
    const parsed = parseInt(wordLimitText || '0', 10);
    const clamped = Math.max(100, isNaN(parsed) ? 100 : parsed);
    setWordLimit(clamped);
    setWordLimitText(String(clamped));
  }
  return (
    <ScreenWrapper>
        <View style={styles.generateContainer}>
            <Text style={styles.label}>Text Prompt</Text>
            <View style={styles.card}>
              <TextInput
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                placeholder='Type something...'
                placeholderTextColor="#708090"
                value={storyTitle}
                style={styles.generate}
                onChangeText={handleStoryTitleChange}
              />
            </View>
            <Text style={styles.infoTitle}>Describe the story you want to generate</Text>
            <View style={styles.inlineRow}>
              <Text style={styles.inlineLabel}>Select Genre</Text>
              <Pressable
                onPress={() => setIsGenreOpen(true)}
                style={[
                  styles.dropdownTrigger,
                  isGenreOpen && styles.dropdownTriggerActive,
                ]}
                hitSlop={8}
              >
                <Text numberOfLines={1} style={styles.dropdownText}>
                  {selectedGenre || 'Select Genre'}
                </Text>
                <Text style={styles.caret}>{isGenreOpen ? '▴' : '▾'}</Text>
              </Pressable>
            </View>
            <View style={[styles.inlineRow, styles.inlineRowEnd]}>
              <Text style={styles.inlineLabel}>Word Limit</Text>
              <TextInput
                value={wordLimitText}
                onChangeText={handleWordLimitChange}
                onBlur={handleWordLimitBlur}
                keyboardType="number-pad"
                style={styles.numericInput}
                maxLength={5}
                accessibilityLabel="Word Limit (minimum 100)"
              />
            </View>
            <Text style={styles.helperText}>Minimum word limit is 100</Text>

            <PrimaryButton
              title="Generate"
              onPress={() => {
                // Placeholder generation handler. Replace with actual generation call.
                Alert.alert('Generating Story', `Title: ${storyTitle || 'Untitled'}\nGenre: ${selectedGenre || 'Not selected'}\nWord Limit: ${wordLimit}`);
              }}
              style={styles.generateButton}
            />
        </View>

        <Modal visible={isGenreOpen} transparent animationType="fade" onRequestClose={() => setIsGenreOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsGenreOpen(false)}>
            <View style={styles.modalCard}>
              <ScrollView contentContainerStyle={styles.optionsContainer}>
                {genres.map((genre) => (
                  <Pressable
                    key={genre}
                    onPress={() => {
                      setSelectedGenre(genre);
                      setIsGenreOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.optionItem,
                      selectedGenre === genre && styles.optionItemSelected,
                      pressed && styles.optionItemPressed,
                    ]}
                  >
                    <Text style={styles.optionText}>{genre}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
    </ScreenWrapper>
  )
}

export default GenerateScreen

const styles = StyleSheet.create({
  generateContainer:{
    marginHorizontal:25
  },
  card:{
    backgroundColor:'#F5F5F5',
    borderColor:'#708090',
    borderWidth:1.5,
    borderRadius:14,
    // Shadows (iOS)
    shadowColor:'#000',
    shadowOpacity:0.08,
    shadowRadius:8,
    shadowOffset:{ width:0, height:4 },
    // Elevation (Android)
    elevation:2,
  },
  inlineRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:12,
    marginTop:24,
    marginBottom:16,
  },
  inlineRowEnd:{
    justifyContent:'space-between',
  },
  inlineLabel:{
    fontSize:16,
    fontWeight:'700',
    letterSpacing:0.5,
    color:'#000',
  },
  dropdownTrigger:{
    flex:1,
    minWidth:0,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    borderColor:'#708090',
    borderWidth:1.5,
    borderRadius:12,
    paddingHorizontal:14,
    paddingVertical:12,
    backgroundColor:'#F5F5F5',
    // subtle shadow
    shadowColor:'#000',
    shadowOpacity:0.06,
    shadowRadius:6,
    shadowOffset:{ width:0, height:3 },
    elevation:1,
  },
  dropdownTriggerActive:{
    borderColor:'#54616e',
  },
  dropdownText:{
    fontSize:16,
    color:'#000',
    flexShrink:1,
  },
  caret:{
    marginLeft:8,
    color:'#708090',
    fontSize:16,
  },
  numericInput:{
    width:130,
    borderColor:'#708090',
    borderWidth:1.5,
    borderRadius:12,
    paddingHorizontal:14,
    paddingVertical:10,
    backgroundColor:'#F5F5F5',
    fontSize:16,
    color:'#000',
    textAlign:'right',
    // subtle shadow
    shadowColor:'#000',
    shadowOpacity:0.06,
    shadowRadius:6,
    shadowOffset:{ width:0, height:3 },
    elevation:1,
  },
  label:{
    fontSize:23,
    fontWeight:"800",
    letterSpacing:0.8,
    marginBottom:10,
    marginTop:50
  },
  generate:{
    width:"100%",
    alignSelf:'center',
    borderRadius:12,
    paddingLeft:14,
    paddingRight:14,
    paddingVertical:16,
    backgroundColor:"#F5F5F5",
    fontSize:16,
    minHeight:120,
  },
  infoTitle:{
    marginTop:6,
    fontWeight:'500',
    color:'#708090'
  },
  helperText:{
    marginTop:4,
    color:'#708090',
    fontSize:12,
  },
  modalBackdrop:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.2)',
    justifyContent:'center',
    paddingHorizontal:24,
  },
  modalCard:{
    backgroundColor:'#fff',
    borderRadius:12,
    borderColor:'#708090',
    borderWidth:1,
    maxHeight:'60%',
    overflow:'hidden',
  },
  optionsContainer:{
    paddingVertical:6,
  },
  optionItem:{
    paddingVertical:12,
    paddingHorizontal:16,
  },
  optionItemPressed:{
    backgroundColor:'#eef1f4',
  },
  optionItemSelected:{
    backgroundColor:'#e3e8ee',
  },
  optionText:{
    fontSize:16,
    color:'#000',
  },
  generateButton:{
    alignSelf:'flex-end',
    marginTop:16,
  }
})