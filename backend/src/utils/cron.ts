import { CronJob } from 'cron';
import prisma from "./prisma"

export const CronTestJob = new CronJob(
    '* * * * *',
    async () => {
        //check for matches in the database  and if found create a job               
        // console.log('Running task every minute');
        // this might be a bad idea though
        async function checkDatabase() {
            const orders = await prisma.order.findMany()
            // console.log("orders", orders)
        }
        await checkDatabase()
    },
    null,
    true,
    'system'
);