import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const YourComponent = () => {
  const [spentValues, setSpentValues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-jxtyv/endpoint/data/v1/action/find', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "dataSource": "Cluster0",
            "database": "expenses",
            "collection": "amount",
            "query": {}
          }),
        });

        const data = await response.json();

        // Extracting only the "spent" values
        const extractedSpentValues = data.documents.map(document => document.spent);
        setSpentValues(extractedSpentValues);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once when the component mounts

  return (
    <View>
      <Text>Spent Values:</Text>
      {spentValues.map((value, index) => (
        <Text key={index}>{value}</Text>
      ))}
    </View>
  );
};

export default YourComponent;
