import mongoose from "mongoose";

// 1. connect to db
// 2. Create test data
// 3. Test queries without indexing
// 4. Add indexes
// 5. Test queries with indexing
// 6. Compare results.

async function connectToDb() {
    await mongoose.connect("mongodb://localhost:27017", {
        dbName: "todo_db"
    }).then(() => {
        console.log("Connection to mongo db is successful");
    }).catch((error) => {
        console.log(`Error while connecting with the db: ${error}`);
    })
}

async function createTestData() {
    // define schema
    const schema = new mongoose.Schema({
        title: String,
        description: String,
        user_id: String,
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    });

    const ToDo = mongoose.model("Schema", schema)

    console.log("Clear db if there is any data");
    await ToDo.deleteMany({});

    // create data
    const todos = [];
    for (let i = 1; i < 100000; i++) {
        todos.push({
            title: `Title : ${i}`,
            description: `This is todo task's description: ${i}`,
            user_id: `user${i % 100}`
        });
    }

    await ToDo.insertMany(todos);
    console.log("insert data successfully");

    return ToDo;
}

async function testQueryPerformace(ToDo, id, description) {
    console.log(`${description}`);

    const result = await ToDo.find({ user_id: id }).explain('executionStats');
    console.log(`   Stage: ${result.queryPlanner.winningPlan.stage}`);
    console.log(`   Documents examined: ${result.executionStats.totalDocsExamined}`);
    console.log(`   Documents returned: ${result.executionStats.nReturned}`);
    console.log(`   Execution time: ${result.executionStats.executionTimeMillis}ms`);

    return result;
}

async function runIndexingTest() {
    await connectToDb();
    const ToDo = await createTestData();
    await testQueryPerformace(ToDo, 'user50', 'Running test without indexing');

    // add indexing
    console.log("\n📚 Adding index on userId...");
    // 1 represents ascending
    await ToDo.collection.createIndex({ user_id: 1 });
    await testQueryPerformace(ToDo, 'user50', 'Running test with indexing');
    await ToDo.collection.dropIndex({ user_id: 1 });
}

// output
/*
Clear db if there is any data
insert data successfully
Running test without indexing
   Stage: COLLSCAN
   Documents examined: 99999
   Documents returned: 1000
   Execution time: 203ms

📚 Adding index on userId...
Running test with indexing
   Stage: FETCH
   Documents examined: 1000
   Documents returned: 1000
   Execution time: 33ms

✅ Test completed! 
*/
runIndexingTest()
    .then(() => {
        console.log("\n✅ Test completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });