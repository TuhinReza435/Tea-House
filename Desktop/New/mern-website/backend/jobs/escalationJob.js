const cron = require('node-cron');
const Complaint = require('../models/Complaint');

// Mapping indicating the NEXT superior authority for the forwarding path
const escalationMap = {
  'Department': 'Chatro upodesta',
  'Chatro upodesta': 'Pro VC',
  'Hall provost': 'Pro VC',
  'Transport office': 'Pro VC',
  'Proctor': 'Pro VC',
  'Pro VC': 'VC',
  // 'VC': null -> Reached the maximum limit, stays with VC
};

const runEscalationJob = () => {
  // Schedule to run every day at midnight. 
  // You can change '0 0 * * *' to '* * * * *' to run every minute for testing.
  cron.schedule('0 0 * * *', async () => {
    console.log('[Escalation Job] Starting daily check for hanging complaints...');
    try {
      // Find all complaints not solved or rejected
      const pendingComplaints = await Complaint.find({
        status: { $in: ['pending', 'accepted'] }
      });

      const now = new Date();
      let updatedCount = 0;

      for (let complaint of pendingComplaints) {
        // Find difference between now and last forwarded time
        const diffMs = now - Math.max(complaint.lastForwardedAt || complaint.createdAt, 0);
        const diffHours = diffMs / (1000 * 60 * 60);

        // If holding more than 2 days (48 hours)
        if (diffHours >= 48) {
          const nextSuperior = escalationMap[complaint.currentAuthority];

          // If there is a superior authority in the ladder
          if (nextSuperior) {
            console.log(`[Escalation Job] Forwarding complaint ${complaint._id} from ${complaint.currentAuthority} to ${nextSuperior}`);
            
            complaint.currentAuthority = nextSuperior;
            complaint.lastForwardedAt = now;
            
            // Add automated log footprint
            complaint.history.push({
              action: 'forwarded',
              actionByAuthority: 'System',
              comment: `Automatically escalated to ${nextSuperior} due to 48 hours of inactivity.`,
              timestamp: now
            });
            
            await complaint.save();
            updatedCount++;
          }
        }
      }

      console.log(`[Escalation Job] Completed. ${updatedCount} complaints escalated.`);
    } catch (error) {
      console.error('[Escalation Job] Failed to execute cron job:', error);
    }
  });

  console.log('Cron Job Initialized: Daily automatic complaint escalation check armed.');
};

module.exports = runEscalationJob;
