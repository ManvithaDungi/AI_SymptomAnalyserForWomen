import {
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export { auth };

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

export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
      isAnonymous: false,
      language: 'english'
    });

    localStorage.setItem('userId', user.uid);
    return user;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    localStorage.setItem('userId', user.uid);
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getUserId = () => {
  return auth.currentUser ? auth.currentUser.uid : localStorage.getItem('userId');
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
