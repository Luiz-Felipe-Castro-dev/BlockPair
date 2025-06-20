// receive matches and process them

import { Worker, Queue } from "bullmq";
import { orderMatching } from "../controllers/Order";


const connection = {
    host: 'localhost',
    port: 6379
};
// this is a queue
const orderQueue = new Queue('orderMatching', { connection });
export async function addJobs(order:any){
    await orderQueue.add("matchOrder",order)
}
// this is a worker
const worker = new Worker("orderMatching", async (job) => {
    // match orders PROCESSING logic
    //
    console.log(job,job.data)
   orderMatching(job.data)
    return { status: 'Processed', orderId: job.data.orderId }
}, { connection })
worker.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed successfully. Result:`, result);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err.message);
});



