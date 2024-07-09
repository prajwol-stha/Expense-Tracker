import { FlatList, StyleSheet, Text, View ,ActivityIndicator} from 'react-native';
import React, { useEffect, useState } from 'react';
import FetchDetailsFromDb from '../FetchDetails';
import { DATABASE_ENDPOINT_FIND } from '../config';
import COLORS from '../colors';

const StatementsScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await FetchDetailsFromDb(DATABASE_ENDPOINT_FIND);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
    <View style={styles.loader}>
      <ActivityIndicator  size="large" color={COLORS.PRIMARY}/>
    </View>
    )
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.leftColumnHeader}>
        <Text style={styles.columnHeaderText}>Remarks</Text>
      </View>
      <View style={styles.rightColumnHeader}>
        <Text style={[styles.columnHeaderText, styles.alignRight]}>Spent</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.leftColumn}>
        <Text style={styles.remarks}>{item.remarks}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.rightColumn}>
        <Text style={[styles.spent, styles.alignRight]}>{item.spent}</Text>
      </View>
    </View>
  );

  return (
    
    <View style={{backgroundColor:'#222222'}}>
    <FlatList
      ListHeaderComponent={renderHeader}
      data={data ? data.documents.slice().reverse() : []}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
</View>

  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  columnHeaderText: {
    fontWeight: 'bold',
    marginLeft:10,
  },
  alignRight: {
    textAlign: 'right',
    marginRight:10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
    marginLeft:10,
  },
  rightColumn: {
    flex: 1,
  },
  leftColumnHeader: {
    flex: 1,
    marginRight: 10,
  },
  rightColumnHeader: {
    flex: 1,
  },
  remarks: {
    fontWeight: 'bold',
  },
  date: {
    color: '#555',
  },
  spent: {
    fontWeight: 'bold',
  },
  loader:{
    flex:1,
    justifyContent:'center',
    backgroundColor:COLORS.BACKGROUND,
  }
});

export default StatementsScreen;
