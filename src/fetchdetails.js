import { CLUSTER_NAME, COLLECTION_NAME, DATABASE_ENDPOINT,DATABASE_ENDPOINT_FIND,DATABASE_NAME, MONGODB_API_KEY } from './config'

console.log(DATABASE_ENDPOINT)
const FetchDetailsFromDb = async (spent) => {
	console.log('Calling FetchDetailsFromDb with spent:', spent);
	let response;
	try {

		response = await fetch(DATABASE_ENDPOINT_FIND,
			{
				method: 'POST',
				cache: 'no-cache', //may break api , remove is problem occurs
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'apiKey': MONGODB_API_KEY
				},
				body: JSON.stringify({
					'dataSource': CLUSTER_NAME,
					'database': DATABASE_NAME,
					'collection': COLLECTION_NAME,
					'filter': {
						'spent':spent
					}
				})
			})

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const details = await response.json();
		// console.log(details)
		return (details.document)

	} catch (error) {
		console.error('fetch failed: ', error)
		// Alert.alert('fetch failed', error)
	}
}

export default FetchDetailsFromDb