import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import FetchDetailsFromDb from './FetchDetails';

const StatementsScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await FetchDetailsFromDb('your-api-endpoint');
        // console.log(result)
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  return (
    <ScrollView>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          {data && data.documents.map((item) => (
            <View key={item._id} style={styles.itemContainer}>
              <Text>Date: {item.date}</Text>
              <Text>Remarks: {item.remarks}</Text>
              <Text>Spent: {item.spent}</Text>
              {/* <Text>Date: {item.date || 'N/A'}</Text>
              <Text>Remarks: {item.remarks || 'N/A'}</Text>
              <Text>Spent: {item.spent || 'N/A'}</Text> */}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
});

export default StatementsScreen;
