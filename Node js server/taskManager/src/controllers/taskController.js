// const {Task} = require('../../models/index')

const admin = require('firebase-admin');
const serviceAccount = require('../../finalprojectsss-firebase-adminsdk-p8jez-c9577404ac.json'); // Update with the path to your service account file

// Initialize Firebase and Firestore
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const tasksCollection = db.collection('tasks');



const getTasks = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is available in req.userId
        const snapshot = await tasksCollection
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc') // Order by createdAt in descending order
            .get(); // Fetch tasks for the logged-in user

        const tasks = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null, // Convert Firestore timestamp to string
            };
        });

        res.json({
            status: 'ok',
            message: 'Tasks fetched successfully',
            tasks,
        });
    } catch (err) {
        console.error('Error fetching tasks:', err); // Log error for debugging
        res.json({ status: 'failed', message: err.message });
    }
};





const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskDoc = await tasksCollection.doc(taskId).get();

        if (!taskDoc.exists) {
            return res.status(404).json({ status: 'failed', message: 'Task not found' });
        }

        const taskData = taskDoc.data();
        const task = {
            id: taskDoc.id,
            ...taskData,
            createdAt: taskData.createdAt ? taskData.createdAt.toDate().toString() : null,
        };

        res.json({
            status: 'ok',
            message: 'Task fetched successfully',
            task: task
        });
    } catch (err) {
        res.json({ status: 'failed', message: err.message });
    }
};


const addTask = async (req, res) => {
    try {
        const { taskContent } = req.body;
        const userId = req.userId;
        const userName = req.userName;
        const created_at = admin.firestore.FieldValue.serverTimestamp();

        const newTask = {
            taskContent,
            userId,
            userName,
            createdAt: created_at,
        };

        // Add new task to Firestore
        const docRef = await tasksCollection.add(newTask);

        // Fetch the created document to get the actual timestamp
        const addedTaskDoc = await docRef.get();
        const addedTaskData = addedTaskDoc.data();

        res.json({
            status: 'ok',
            message: 'Task added successfully',
            task: {
                id: docRef.id,
                taskContent: addedTaskData.taskContent,
                createdAt: addedTaskData.createdAt.toDate().toISOString(), // Convert to ISO string
            },
        });
    } catch (err) {
        res.json({ status: 'failed', message: err.message });
    }
};




const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        await tasksCollection.doc(id).delete(); // Delete task from Firestore
        res.json({ status: 'ok', message: 'Task has been deleted successfully!' });
    } catch (err) {
        res.json({ status: 'failed', message: err.message });
    }
};



const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const { taskContent } = req.body;
        await tasksCollection.doc(id).update({ taskContent }); // Update task in Firestore
        res.json({ status: 'ok', message: 'Task has been updated successfully!' });
    } catch (err) {
        res.json({ status: 'failed', message: err.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    addTask,
    deleteTask,
    updateTask,
}



//Using SQL database instead of Firebase


// const getTasks = async (req,res) => {
//     try{
//         const tasks = await Task.findAll({ where: { userId: req.userId } });
//         res.json({status: 'ok', message: 'tasks is fetched from db successfully', tasks: tasks})
//     }catch(err){
//         res.json({status: 'failed', message: err.message})
//     }
// }


// const getTaskById = async (req, res) => {
//     try{
//         const taskId = req.params.id
//         const task = await Task.findByPk(taskId)
//         res.json({status: "ok", message:"Task fetched successfuly!", task: task})
//     }catch(err){
//         res.json({status: "failed", message: "unable to get this task, try again later!"})
//     }
// }

// const addTask = async (req, res) => {
//     try{
//         const { taskContent } = req.body;
//         const task = await Task.create({ taskContent, userId: req.userId });
//         res.json({status: 'ok', message:'task added successfuly',task: task, taskId: task.id})
//     }catch(err){
//         res.json({status: 'failed', message: err.message})
//     }
// }


// const deleteTask = async (req, res) => {
//     try{
//         const id = req.params.id
//         await Task.destroy({
//             where:{
//                 id : parseInt(id)
//             }
//         })
//         res.json({status: 'ok', message: 'task has been deleted successfuly!'})
//     }catch(err){
//         res.json({status: 'failed', message: err.message})
//     }
// }


// const updateTask = async (req, res) => {
//     try{
//         const id = parseInt(req.params.id)
//         const {taskContent} = req.body
//         await Task.update(
//             {taskContent},
//             {where: {
//                 id: id
//             }}
//         )
//         res.json({status: 'ok', message: "Task has been updated successfuly!"})
//     }catch(err){
//         res.json({status: 'failed', message: err.message})
//     }
// }