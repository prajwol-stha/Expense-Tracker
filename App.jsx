import { View, Text } from 'react-native'
import React from 'react'
import Homescreen from './src/Homescreen'
import Realm from 'realm'

// const TaskSchema = {
//   name: "Task",
//   properties: {
//   _id: "int",
//   name: "string",
//   status: "string?",
//   },
//   primaryKey: "_id",
//   };
// (async ()=>{
//   // use realm to interact with dal
//   const realm = await Realm.open({
//   path: "myrealm",
//   schema: [TaskSchema],
//   });

//   realm.write(() => {
//     task1= realm.create("Task", {
//     _id: 1,
//     name: "go grocery shopping",
//     dateCreated:Date.now(),
//     status: "Open",
//     });
//     task2= realm.create("Task", {
//     _id: 2,
//     name: "go exercise",
//     dateCreated:Date.now(),
//     status: "Open",
//     });
//     console.log(`created two tasks: ${task1.name} & ${task2.name}`);
//     });
// })();



const App = () => {
  return (
    <Homescreen/>
  )
}

export default App