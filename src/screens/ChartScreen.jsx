import { FlatList, StyleSheet, Text, View, Dimensions ,ActivityIndicator} from 'react-native';
import React, { useEffect, useState } from 'react';
import FetchDetailsFromDb from '../FetchDetails';
import { DATABASE_ENDPOINT_FIND } from '../config';
import COLORS from '../colors';

import {
    LineChart,
} from "react-native-chart-kit";


const StatementsScreen = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await FetchDetailsFromDb(DATABASE_ENDPOINT_FIND);
        const organizedData = result.documents.reduce((acc, item) => {
          const { date, spent } = item;
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += spent;
          return acc;
        }, {});

        // Extract the last 20 days of data
        const sortedDates = Object.keys(organizedData).sort((a, b) => new Date(a) - new Date(b));
        const last20Dates = sortedDates.slice(-20);

        // console.log(last20Dates)
        const getDateNumbers = (dates) => {
          return dates.map(date => {
            const day = date.split(' ')[0]; //take first part after splitting i.e. 01 of 01 Jan 2024
            return day;
          });
        };
        
        const dateNumbers = getDateNumbers(last20Dates);
        console.log(dateNumbers);

        const labels = dateNumbers;
        const data = last20Dates.map(date => organizedData[date]);

        setChartData({
          labels: labels,
          datasets: [{ data: data }],
        });
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

  return (
    <View style={{ backgroundColor: '#222222', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', marginBottom: 20 }}>Total Spent Per Day (Last 20 Days)</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width-10} 
        height={220}
        yAxisLabel="" // Add prefix to Y-axis labels
        yAxisSuffix="" // Add suffix to Y-axis labels
        chartConfig={{
          backgroundGradientFrom: COLORS.PRIMARY,
          backgroundGradientTo: "#17650d",
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "2",
            strokeWidth: "2",
            stroke: "#ffffff",
          },
          formatYLabel: (yValue) => `${yValue}`, // Custom Y-axis label format
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 12,
        }}
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
    marginLeft: 10,
  },
  alignRight: {
    textAlign: 'right',
    marginRight: 10,
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
    marginLeft: 10,
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
    justifyContent: 'center',
    backgroundColor:COLORS.BACKGROUND,
  }
});

export default StatementsScreen;
