import mongoose from "mongoose";

const SOURCE_URI =
  "mongodb+srv://balamuruganwebdeveloper:BALADEVELOPER@cluster0.4a5lbbc.mongodb.net/website?retryWrites=true&w=majority&appName=Cluster0";
const DEST_URI =
  "mongodb+srv://pentaxialtechnologies:Dev%402k26@staging.58bgooy.mongodb.net/staff-website?retryWrites=true&w=majority&appName=Staging";

async function cloneSchemaWithData() {
  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
  const destConn = await mongoose.createConnection(DEST_URI).asPromise();

  console.log("✅ Connected to both Source and Destination");

  const collections = await sourceConn.db.listCollections().toArray();

  for (const coll of collections) {
    console.log(`🔹 Processing collection: ${coll.name}`);

    const collInfo = await sourceConn.db.command({
      listCollections: 1,
      filter: { name: coll.name },
    });
    const options = collInfo.cursor.firstBatch[0].options || {};

    // Create collection with options if it doesn't exist
    try {
      await destConn.db.createCollection(coll.name, options);
      console.log(`✅ Created collection: ${coll.name}`);
    } catch (err) {
      if (err.codeName === "NamespaceExists") {
        console.log(`⚠️ Collection already exists: ${coll.name}`);
      } else {
        throw err;
      }
    }

    // Copy indexes
    const indexes = await sourceConn.db.collection(coll.name).indexes();
    for (const index of indexes) {
      if (index.name === "_id_") continue; 
      console.log(`  🔸 Creating index: ${index.name}`);
      try {
        await destConn.db.collection(coll.name).createIndex(index.key, index);
      } catch (err) {
        console.error(`❌ Failed to create index ${index.name}:`, err.message);
      }
    }

    // Copy data
    const docs = await sourceConn.db.collection(coll.name).find().toArray();
    if (docs.length > 0) {
      console.log(`📦 Copying ${docs.length} documents...`);
      try {
        await destConn.db.collection(coll.name).insertMany(docs);
        console.log(`✅ Inserted ${docs.length} documents into ${coll.name}`);
      } catch (err) {
        console.error(`❌ Failed to insert documents:`, err.message);
      }
    } else {
      console.log(`ℹ️ No documents to copy in ${coll.name}`);
    }
  }

  console.log("🎉 Schema + Data duplication completed successfully!");

  await sourceConn.close();
  await destConn.close();
}

if (require.main === module) {
  cloneSchemaWithData().catch((err) => {
    console.error("❌ Error during schema+data duplication:", err);
    process.exit(1);
  });
}

export default cloneSchemaWithData;
