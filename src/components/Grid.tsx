// Responsive grid component for story layouts

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../utils/responsive';
import { useThemeContext } from '../context/ThemeContext';

interface GridProps {
  children: React.ReactNode;
  columns?: number | 'auto';
  spacing?: number;
  itemMinWidth?: number;
  style?: ViewStyle;
  testID?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  columns = 'auto',
  spacing = 16,
  itemMinWidth = 150,
  style,
  testID,
}) => {
  const { getGridColumns, dimensions } = useResponsive();
  const { theme } = useThemeContext();
  
  // Calculate number of columns
  const numColumns = columns === 'auto' 
    ? getGridColumns(itemMinWidth, spacing)
    : columns;
  
  // Convert children to array for processing
  const childrenArray = React.Children.toArray(children);
  
  // Create rows of items
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < childrenArray.length; i += numColumns) {
    rows.push(childrenArray.slice(i, i + numColumns));
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { marginBottom: spacing }]}>
          {row.map((child, itemIndex) => (
            <View
              key={itemIndex}
              style={[
                styles.item,
                {
                  flex: 1,
                  marginRight: itemIndex < row.length - 1 ? spacing : 0,
                },
              ]}
            >
              {child}
            </View>
          ))}
          {/* Fill empty spaces in the last row */}
          {row.length < numColumns && 
            Array.from({ length: numColumns - row.length }).map((_, emptyIndex) => (
              <View
                key={`empty-${emptyIndex}`}
                style={[
                  styles.item,
                  {
                    flex: 1,
                    marginRight: emptyIndex < numColumns - row.length - 1 ? spacing : 0,
                  },
                ]}
              />
            ))
          }
        </View>
      ))}
    </View>
  );
};

// Alternative implementation using FlatList for better performance with large datasets
export const GridList: React.FC<{
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactElement;
  columns?: number | 'auto';
  spacing?: number;
  itemMinWidth?: number;
  style?: ViewStyle;
  testID?: string;
}> = ({
  data,
  renderItem,
  columns = 'auto',
  spacing = 16,
  itemMinWidth = 150,
  style,
  testID,
}) => {
  const { getGridColumns } = useResponsive();
  
  const numColumns = columns === 'auto' 
    ? getGridColumns(itemMinWidth, spacing)
    : columns;

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* This would typically use FlatList with numColumns prop */}
      {/* For now, using the basic Grid implementation */}
      <Grid columns={numColumns} spacing={spacing}>
        {data.map((item, index) => renderItem({ item, index }))}
      </Grid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base container styles
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  item: {
    // Individual item styles
  },
});

export default Grid;