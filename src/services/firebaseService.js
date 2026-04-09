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
  getDoc,
  serverTimestamp,
  orderBy,
  limit,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  runTransaction,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { getSecureAnonId } from '../utils/anonId.js';
import { logger } from '../utils/logger.js';
import { PAGINATION } from '../config/constants.js';

export { auth };

export const initializeAuth = async () => {
  try {
    const result = await signInAnonymously(auth);
    const userId = result.user.uid;
    localStorage.setItem('userId', userId);
    logger.log('Anonymous auth initialized', userId);
    return userId;
  } catch (error) {
    logger.error('Auth initialization failed', error);
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
    logger.log('User signed up successfully', user.uid);
    return user;
  } catch (error) {
    logger.error('Sign up failed', error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    localStorage.setItem('userId', user.uid);
    logger.log('User logged in', user.uid);
    return user;
  } catch (error) {
    logger.error('Login failed', error);
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
    logger.log('Symptom log saved', { userId, symptomsCount: symptoms.length });
  } catch (error) {
    logger.error('Failed to save symptom log', error);
    throw error;
  }
};

export const getForumPosts = async (topic = 'all', sortBy = 'recent', language = 'en') => {
  try {
    const base = collection(db, 'forum_posts');

    const constraints = [
      where('approved', '==', true),
      where('language', '==', language)
    ];

    if (topic && topic !== 'all' && topic !== 'All') {
      constraints.push(where('topic', '==', topic));
    }

    if (sortBy === 'recent') {
      constraints.push(orderBy('createdAt', 'desc'));
    } else {
      constraints.push(orderBy('upvotes', 'desc'));
    }

    constraints.push(limit(PAGINATION.FORUM_POSTS_PER_PAGE));

    const q = query(base, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    }));
  } catch (error) {
    // Provide user-friendly message while index is being created
    if (error.message && error.message.includes('requires an index')) {
      logger.warn('Firestore index is being created. This usually takes 2-5 minutes. Please refresh the page shortly.');
      return []; // Return empty array while index builds
    }
    logger.error('Failed to fetch forum posts', error);
    throw error;
  }
};

export const saveForumPost = async (postData) => {
  try {
    const language = localStorage.getItem('language') || 'en';
    // Ensure approved is explicit boolean
    const approved = Boolean(postData.approved) === true;
    await addDoc(collection(db, 'forum_posts'), {
      ...postData,
      language,
      createdAt: serverTimestamp(),
      upvotes: postData.upvotes ?? 0,
      upvotedBy: postData.upvotedBy ?? [],
      commentCount: postData.commentCount ?? 0,
      approved, // Explicit boolean validation
      isPinned: postData.isPinned ?? false,
      isExpertAnswered: postData.isExpertAnswered ?? false,
    });
    logger.log('Forum post saved', { language, approved });
  } catch (error) {
    logger.error('Failed to save forum post', error);
    throw error;
  }
};

export const getForumPostById = async (postId) => {
  try {
    const snapshot = await getDoc(doc(db, 'forum_posts', postId));
    if (!snapshot.exists()) return null;
    logger.log('Forum post retrieved', postId);
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    logger.error('Failed to fetch forum post', error);
    throw error;
  }
};

export const getPostComments = async (postId) => {
  try {
    const q = query(
      collection(db, 'forum_posts', postId, 'comments'),
      where('approved', '==', true),
      orderBy('createdAt', 'asc'),
      limit(PAGINATION.COMMENTS_PER_PAGE)
    );
    const snapshot = await getDocs(q);
    logger.log('Comments retrieved', { postId, count: snapshot.docs.length });
    return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
  } catch (error) {
    logger.error('Failed to fetch comments', error);
    throw error;
  }
};

export const addPostComment = async (postId, commentData) => {
  try {
    const commentRef = collection(db, 'forum_posts', postId, 'comments');
    await addDoc(commentRef, {
      ...commentData,
      createdAt: serverTimestamp(),
      upvotes: commentData.upvotes ?? 0,
      upvotedBy: commentData.upvotedBy ?? [],
      approved: commentData.approved ?? true,
      isExpertComment: commentData.isExpertComment ?? false,
    });
    const postRef = doc(db, 'forum_posts', postId);
    await updateDoc(postRef, {
      commentCount: increment(1),
    });
    logger.log('Comment added', { postId });
  } catch (error) {
    logger.error('Failed to add comment', error);
    throw error;
  }
};

export const togglePostUpvote = async (postId, userId) => {
  try {
    const postRef = doc(db, 'forum_posts', postId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(postRef);
      if (!snap.exists()) return;
      const data = snap.data();
      const hasUpvoted = (data.upvotedBy || []).includes(userId);
      transaction.update(postRef, {
        upvotedBy: hasUpvoted ? arrayRemove(userId) : arrayUnion(userId),
        upvotes: increment(hasUpvoted ? -1 : 1),
      });
    });
    logger.log('Post upvote toggled', { postId, userId });
  } catch (error) {
    logger.error('Failed to toggle post upvote', error);
    throw error;
  }
};

export const toggleCommentUpvote = async (postId, commentId, userId) => {
  try {
    const commentRef = doc(db, 'forum_posts', postId, 'comments', commentId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(commentRef);
      if (!snap.exists()) return;
      const data = snap.data();
      const hasUpvoted = (data.upvotedBy || []).includes(userId);
      transaction.update(commentRef, {
        upvotedBy: hasUpvoted ? arrayRemove(userId) : arrayUnion(userId),
        upvotes: increment(hasUpvoted ? -1 : 1),
      });
    });
    logger.log('Comment upvote toggled', { postId, commentId, userId });
  } catch (error) {
    logger.error('Failed to toggle comment upvote', error);
    throw error;
  }
};

/**
 * Get secure anonymous ID for use in forum posts
 * Uses browser fingerprinting and session storage for security
 * @returns {Promise<string>} Secure anonymous ID
 */
export const getAnonName = async () => {
  try {
    const secureId = await getSecureAnonId();
    logger.log('Secure anonymous ID retrieved');
    return secureId;
  } catch (error) {
    logger.error('Failed to generate secure anonymous ID', error);
    // Fallback to simple ID if secure method fails
    return `Anon#${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }
};

// Journal Services
export const saveJournalEntry = async (userId, entryData) => {
  try {
    const date = entryData.date; // YYYY-MM-DD
    const docId = `${userId}_${date}`; // Document ID: userId_Date
    await setDoc(doc(db, 'journal_entries', docId), {
      userId,
      ...entryData,
      updatedAt: serverTimestamp(),
      // Add createdAt if new (merge: true handles updates but we want dedicated field)
      createdAt: serverTimestamp()
    }, { merge: true });
    logger.log('Journal entry saved', { userId, date });
  } catch (error) {
    logger.error('Failed to save journal entry', error);
    throw error;
  }
};

export const getJournalEntries = async (userId, monthKey) => {
  // monthKey format: 'YYYY-MM'
  try {
    // Use proper Firestore range queries for date filtering
    const constraints = [where('userId', '==', userId)];
    
    // If monthKey provided, add date range constraints
    if (monthKey) {
      const monthStart = `${monthKey}-00`;
      const monthEnd = `${monthKey}-99`;
      constraints.push(where('date', '>=', monthStart));
      constraints.push(where('date', '<=', monthEnd));
    }
    
    constraints.push(orderBy('date', 'desc'));
    constraints.push(limit(PAGINATION.JOURNAL_ENTRIES_PER_PAGE));
    
    const q = query(collection(db, 'journal_entries'), ...constraints);
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    logger.log('Journal entries retrieved', { userId, count: entries.length, monthKey });
    return entries;
  } catch (error) {
    logger.error('Failed to fetch journal entries', error);
    throw error;
  }
};

export const getJournalEntry = async (userId, dateStr) => {
  try {
    const docId = `${userId}_${dateStr}`;
    const snap = await getDoc(doc(db, 'journal_entries', docId));
    if (snap.exists()) {
      logger.log('Journal entry retrieved', { userId, dateStr });
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (error) {
    logger.error('Failed to fetch journal entry', error);
    throw error;
  }
};
