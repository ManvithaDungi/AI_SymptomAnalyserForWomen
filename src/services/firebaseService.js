import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export const initializeAuth = async () => {
  try {
    const result = await signInAnonymously(auth);
    const userId = result.user.uid;
    localStorage.setItem('userId', userId);
    return userId;
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
};

export const getUserId = () => {
  return localStorage.getItem('userId') || null;
};

export const saveSymptomLog = async (userId, symptoms, result) => {
  try {
    await addDoc(collection(db, 'symptom_logs'), {
      userId,
      symptoms,
      result,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving symptom log:', error);
    throw error;
  }
};

export const getForumPosts = async (topic = null) => {
  try {
    let q;
    if (topic && topic !== 'All') {
      q = query(collection(db, 'forum_posts'), where('topic', '==', topic));
    } else {
      q = collection(db, 'forum_posts');
    }
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    throw error;
  }
};

export const saveForumPost = async (userId, content, topic) => {
  try {
    await addDoc(collection(db, 'forum_posts'), {
      userId,
      content,
      topic,
      hearts: 0,
      timestamp: serverTimestamp(),
      approved: true,
    });
  } catch (error) {
    console.error('Error saving forum post:', error);
    throw error;
  }
};
