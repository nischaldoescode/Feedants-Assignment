// demo seed
import { connectDatabase, closeDatabase } from '../config/database.js';
import { Competition } from '../models/Competition.js';
import { Participation } from '../models/Participation.js';
import { Submission } from '../models/Submission.js';

const demoUserId = 'demo-user-1';

// seed dates stay useful whenever the app is opened
function daysFromNow(days, hour, minute) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

// reset the demo page into a registered state
async function run() {
  await connectDatabase();

  const seedCompetition = {
    slug: 'feedants-classical-dance',
    title: 'Feedants Classical Dance',
    status: 'published',
    tags: ['Dance', 'Multi-Win'],
    format: 'Multi-Win',
    certificateAwarded: true,
    prizePool: 1500,
    entryFee: 99,
    currency: 'INR',
    totalSpots: 20,
    bookedSpots: 1,
    registeredUserIds: [demoUserId],
    judge: {
      name: 'Manju Dubey',
      title: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      photoUrl: 'https://i.pravatar.cc/240?img=47',
      introVideoUrl: 'https://videos.pexels.com/video-files/853870/853870-hd_1280_720_25fps.mp4'
    },
    timeline: {
      registrationOpensAt: daysFromNow(-3, 9, 0),
      registrationClosesAt: daysFromNow(3, 23, 50),
      submissionStartsAt: daysFromNow(-1, 4, 0),
      submissionEndsAt: daysFromNow(7, 23, 55),
      resultAt: daysFromNow(9, 23, 50)
    },
    previousWinners: [
      {
        name: 'Riya Shah',
        position: '1st Winner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=280&q=80',
        videoUrl: 'https://videos.pexels.com/video-files/2795748/2795748-hd_1280_720_25fps.mp4'
      },
      {
        name: 'Aarav Mehta',
        position: '1st Winner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=280&q=80',
        videoUrl: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4'
      },
      {
        name: 'Neha Verma',
        position: '2nd Winner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=280&q=80',
        videoUrl: 'https://videos.pexels.com/video-files/853870/853870-hd_1280_720_25fps.mp4'
      },
      {
        name: 'Ishita Chouhan',
        position: '3rd Winner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=280&q=80',
        videoUrl: 'https://videos.pexels.com/video-files/2795748/2795748-hd_1280_720_25fps.mp4'
      }
    ],
    tabs: [
      {
        key: 'about',
        label: 'About Competition',
        body: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through a traditional dance.'
      },
      {
        key: 'judging',
        label: 'Judging Parameters',
        body: 'Entries are judged on taal, expression, posture, costume neatness, camera framing, and how naturally the performance holds attention.'
      },
      {
        key: 'rules',
        label: 'Rules & Eligibility',
        body: 'Submit one original solo performance. Video must be clear, under five minutes, and uploaded before the submission window closes. Paid participants are considered for judging.'
      }
    ],
    rewards: [
      { rank: 1, title: '1st Winner', amount: 550, icon: 'trophy' },
      { rank: 2, title: '2nd Winner', amount: 300, icon: 'shield' },
      { rank: 3, title: '3rd Winner', amount: 240, icon: 'award' },
      { rank: 4, title: '4th Winner', amount: 200, icon: 'star' },
      { rank: 5, title: '5th Winner', amount: 130, icon: 'star' },
      { rank: 6, title: '6th Winner', amount: 80, icon: 'star' }
    ],
    referral: {
      code: 'referral123',
      url: 'https://feedants.com/r/referral123',
      rewardPerSignup: 10,
      discountText: 'Refer & Earn more discount'
    },
    supportVideo: {
      title: 'How will you receive prize money?',
      subtitle: 'Watch video to know more',
      videoUrl: 'https://videos.pexels.com/video-files/2795748/2795748-hd_1280_720_25fps.mp4'
    },
    trustItems: [
      { icon: 'shield', label: 'Refund policy', value: 'Refunds are allowed before submissions begin' },
      { icon: 'lock', label: 'Secure payments powered by', value: 'Razorpay' }
    ],
    testimonialSummary: {
      title: 'Hear From Our Users',
      subtitle: 'See what participants say about Feedants'
    },
    disclaimer: 'Only contributions from paid participants will be considered for judging.'
  };

  const competition = await Competition.findOneAndUpdate(
    { slug: seedCompetition.slug },
    { $set: seedCompetition },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Participation.findOneAndUpdate(
    { competitionId: competition._id, userId: demoUserId },
    {
      $set: {
        status: 'registered',
        paymentStatus: 'paid',
        language: 'en',
        referralCode: 'referral123',
        paymentProvider: 'mock',
        paymentReference: `mock_${competition._id}_${demoUserId}`,
        registeredAt: new Date(),
        cancelledAt: null,
        submittedAt: null
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Submission.deleteMany({ competitionId: competition._id, userId: demoUserId });

  console.log(`Seeded ${seedCompetition.title}`);
  console.log(`Demo user id: ${demoUserId}`);

  await closeDatabase();
}

run().catch(async (error) => {
  console.error(error);
  await closeDatabase();
  process.exit(1);
});
