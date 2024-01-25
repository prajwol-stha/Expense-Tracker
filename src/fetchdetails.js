import { CLUSTER_NAME, COLLECTION_NAME, DATABASE_ENDPOINT, DATABASE_NAME, MONGODB_API_KEY } from "./config";

  const fetchDetailsFromDb = async (classNumber) => {
	try {
	  const response = await fetch(DATABASE_ENDPOINT, {
		method: 'POST',
		cache: 'no-cache',
		headers: {
		  'Content-Type': 'application/json',
		  'Accept': 'application/json',
		  'apiKey': MONGODB_API_KEY,
		},
		body: JSON.stringify({
		  'dataSource': CLUSTER_NAME,
		  'database': DATABASE_NAME,
		  'collection': COLLECTION_NAME,
		  'filter': {
			'age': classNumber,
		  },
		}),
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
  
	  const details = await response.json();
	//   console.log(details);
	  return details.document;
	} catch (error) {
	  console.error('Fetch failed: ', error);
	  // Handle the error as needed (e.g., show an alert)
	}
  };
  
  const updateDetailsInDb = async (documentId, updatedData) => {
	try {
	  const response = await fetch(`${DATABASE_ENDPOINT}/${documentId}`, {
		method: 'PUT', // or 'PATCH' depending on your API
		cache: 'no-cache',
		headers: {
		  'Content-Type': 'application/json',
		  'Accept': 'application/json',
		  'apiKey': MONGODB_API_KEY,
		},
		body: JSON.stringify({
		  'dataSource': CLUSTER_NAME,
		  'database': DATABASE_NAME,
		  'collection': COLLECTION_NAME,
		  'documentId': '65af8a9d8ce5a12d1ef9f449',
		  'updateData': {
			"name":"saurav"
		  },
		}),
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
  
	  const updatedDetails = await response.json();
	  console.log(updatedDetails);
	  return updatedDetails;
	} catch (error) {
	  console.error('Update failed: ', error);
	  // Handle the error as needed (e.g., show an alert)
	}
  };
  
  export { fetchDetailsFromDb, updateDetailsInDb };


