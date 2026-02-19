import { db } from '../firebase/firebaseConfig';
import { collection, doc, setDoc, addDoc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { remediesData } from './remediesData';

const forumTopics = [
   {
      id: "pcos-support",
      title: "PCOS Support",
      titleTamil: "பிசிஓஎஸ் ஆதரவு",
      description: "Share your PCOS journey and tips",
      icon: "🌸",
      color: "rgba(109,91,208,0.12)",
      postCount: 0
   },
   {
      id: "anemia-diet",
      title: "Anemia & Diet",
      titleTamil: "இரத்த சோகை & உணவு",
      description: "Iron-rich foods, fatigue management and more",
      icon: "🥗",
      color: "rgba(184,212,190,0.2)",
      postCount: 0
   },
   {
      id: "menstrual-health",
      title: "Menstrual Health",
      titleTamil: "மாதவிடாய் ஆரோக்கியம்",
      description: "Safe space to discuss periods openly",
      icon: "🌙",
      color: "rgba(155,142,196,0.15)",
      postCount: 0
   },
   {
      id: "home-remedies",
      title: "Home Remedies",
      titleTamil: "வீட்டு வைத்தியம்",
      description: "Traditional remedies — what works, what doesn't",
      icon: "🌿",
      color: "rgba(184,212,190,0.25)",
      postCount: 0
   },
   {
      id: "general-wellness",
      title: "General Wellness",
      titleTamil: "பொது ஆரோக்கியம்",
      description: "Lifestyle, mental health, and everyday wellbeing",
      icon: "💫",
      color: "rgba(196,149,106,0.1)",
      postCount: 0
   }
];

const forumPosts = [
   {
      username: "Anon#2847",
      topic: "pcos-support",
      topicLabel: "PCOS Support",
      content: "Has anyone tried inositol supplements for PCOS? My doctor mentioned it and I wanted to hear real experiences before starting.",
      likes: 14,
      approved: true,
      isVerified: false,
      daysAgo: 3
   },
   {
      username: "Anon#5631",
      topic: "pcos-support",
      topicLabel: "PCOS Support",
      content: "I was diagnosed with PCOS last year and felt so alone. Finding this community helped me realize how common it is. You are not alone, sisters 💜",
      likes: 32,
      approved: true,
      isVerified: false,
      daysAgo: 5
   },
   {
      username: "Dr. Priya Verified",
      topic: "pcos-support",
      topicLabel: "PCOS Support",
      content: "For PCOS management, lifestyle changes are as important as medication. Regular walking (30 min/day), reducing refined sugar, and managing stress through yoga can significantly improve symptoms over 3-6 months. Always work with your doctor for personalized care.",
      likes: 67,
      approved: true,
      isVerified: true,
      daysAgo: 7
   },
   {
      username: "Anon#9134",
      topic: "anemia-diet",
      topicLabel: "Anemia & Diet",
      content: "My hemoglobin was 8.2 and I felt exhausted constantly. Started eating ragi every morning and drumstick leaves curry 3x a week. After 2 months it went up to 10.5. Small changes really do help!",
      likes: 45,
      approved: true,
      isVerified: false,
      daysAgo: 2
   },
   {
      username: "Anon#3372",
      topic: "anemia-diet",
      topicLabel: "Anemia & Diet",
      content: "Does anyone know if eating iron-rich food with vitamin C really helps absorption? I heard you should eat amla or lemon alongside iron foods. Is this true?",
      likes: 19,
      approved: true,
      isVerified: false,
      daysAgo: 1
   },
   {
      username: "Dr. Meena Verified",
      topic: "anemia-diet",
      topicLabel: "Anemia & Diet",
      content: "Yes, Vitamin C absolutely enhances iron absorption! Squeeze lemon on your greens, eat amla chutney with your meals, or drink a small glass of orange juice alongside iron-rich foods. Also avoid tea/coffee immediately after meals as tannins reduce absorption.",
      likes: 89,
      approved: true,
      isVerified: true,
      daysAgo: 1
   },
   {
      username: "Anon#7821",
      topic: "menstrual-health",
      topicLabel: "Menstrual Health",
      content: "I used to think severe cramps were normal and just had to be tolerated. Turns out I had endometriosis. Please don't ignore very painful periods — it is okay to seek help. Your pain is valid.",
      likes: 78,
      approved: true,
      isVerified: false,
      daysAgo: 4
   },
   {
      username: "Anon#4409",
      topic: "menstrual-health",
      topicLabel: "Menstrual Health",
      content: "Does anyone else struggle with mood swings a week before periods? I feel like a completely different person. Would love to know how others manage this.",
      likes: 23,
      approved: true,
      isVerified: false,
      hoursAgo: 6
   },
   {
      username: "Anon#1156",
      topic: "home-remedies",
      topicLabel: "Home Remedies",
      content: "My grandmother swore by methi (fenugreek) seeds soaked overnight for irregular periods. I tried it for 2 months and my cycle became more regular. Has anyone else tried this?",
      likes: 31,
      approved: true,
      isVerified: false,
      daysAgo: 8
   },
   {
      username: "Anon#6683",
      topic: "home-remedies",
      topicLabel: "Home Remedies",
      content: "Please be careful with home remedies during pregnancy. Some herbs that are fine normally can be harmful during pregnancy. Always tell your doctor what you are taking, even if it seems natural.",
      likes: 54,
      approved: true,
      isVerified: false,
      daysAgo: 3
   },
   {
      username: "Anon#8847",
      topic: "general-wellness",
      topicLabel: "General Wellness",
      content: "Started tracking my sleep, water intake, and mood alongside my cycle using this app's journal. The patterns it showed me were eye-opening. I never realized how much my energy dips 2 days before my period starts.",
      likes: 41,
      approved: true,
      isVerified: false,
      daysAgo: 2
   },
   {
      username: "Anon#3301",
      topic: "general-wellness",
      topicLabel: "General Wellness",
      content: "Mental health is also women's health. I want to normalize talking about anxiety and stress in this community. We carry so much. It is okay to not be okay sometimes 💜",
      likes: 96,
      approved: true,
      isVerified: false,
      daysAgo: 10
   }
];

export const seedFirestore = async () => {
   console.log('🌱 Starting seeding process...');
   const logs = [];

   try {
      // 1. Seed Forum Topics
      const topicsRef = collection(db, 'forum_topics');
      const topicsSnapshot = await getDocs(topicsRef);

      if (topicsSnapshot.empty) {
         console.log('Seeding forum topics...');
         logs.push('Seeding forum topics...');

         for (const topic of forumTopics) {
            await setDoc(doc(db, 'forum_topics', topic.id), {
               ...topic,
               createdAt: serverTimestamp()
            });
         }
         console.log('✅ Forum topics seeded.');
         logs.push('✅ Forum topics seeded.');
      } else {
         console.log('Skipping forum topics (already exist).');
         logs.push('Skipping forum topics (already exist).');
      }

      // 2. Seed Forum Posts
      const postsRef = collection(db, 'forum_posts');
      const postsSnapshot = await getDocs(postsRef);

      if (postsSnapshot.empty) {
         console.log('Seeding forum posts...');
         logs.push('Seeding forum posts...');

         for (const post of forumPosts) {
            const timestamp = post.hoursAgo
               ? Timestamp.fromMillis(Date.now() - post.hoursAgo * 60 * 60 * 1000)
               : Timestamp.fromMillis(Date.now() - (post.daysAgo || 0) * 24 * 60 * 60 * 1000);

            const { daysAgo, hoursAgo, ...postData } = post;

            await addDoc(collection(db, 'forum_posts'), {
               ...postData,
               createdAt: timestamp
            });
         }
         console.log('✅ Forum posts seeded.');
         logs.push('✅ Forum posts seeded.');
      } else {
         console.log('Skipping forum posts (already exist).');
         logs.push('Skipping forum posts (already exist).');
      }

      // 3. Seed Remedies
      const remediesRef = collection(db, 'remedies');
      const remediesSnapshot = await getDocs(remediesRef);

      if (remediesSnapshot.empty) {
         console.log('Seeding remedies...');
         logs.push('Seeding remedies...');

         for (const remedy of remediesData) {
            await addDoc(collection(db, 'remedies'), {
               ...remedy,
               createdAt: serverTimestamp()
            });
         }
         console.log('✅ Remedies seeded.');
         logs.push('✅ Remedies seeded.');
      } else {
         console.log('Skipping remedies (already exist).');
         logs.push('Skipping remedies (already exist).');
      }

      console.log('🎉 Database seeding completed!');
      logs.push('🎉 Database seeding completed!');
      return { success: true, logs };

   } catch (error) {
      console.error('Error seeding database:', error);
      return { success: false, error: error.message };
   }
};
