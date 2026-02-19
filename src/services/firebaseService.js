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
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  runTransaction,
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
    const base = collection(db, 'forum_posts');
    // Fetch all posts first to avoid index issues during development
    const querySnapshot = await getDocs(base);

    let posts = querySnapshot.docs.map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    }));

    // Client-side filtering
    posts = posts.filter(post => post.approved === true);

    // Client-side topic filtering
    if (topic && topic !== 'All' && topic !== 'all') {
      posts = posts.filter(post => post.topic === topic);
    }

    // Client-side sorting (handle both Firestore Timestamp and Date objects)
    posts.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA; // Descending
    });

    return posts;
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    throw error;
  }
};

export const saveForumPost = async (postData) => {
  try {
    await addDoc(collection(db, 'forum_posts'), {
      ...postData,
      createdAt: serverTimestamp(),
      upvotes: postData.upvotes ?? 0,
      upvotedBy: postData.upvotedBy ?? [],
      commentCount: postData.commentCount ?? 0,
      approved: postData.approved ?? true,
      isPinned: postData.isPinned ?? false,
      isExpertAnswered: postData.isExpertAnswered ?? false,
    });
  } catch (error) {
    console.error('Error saving forum post:', error);
    throw error;
  }
};

export const getForumPostById = async (postId) => {
  try {
    const snapshot = await getDoc(doc(db, 'forum_posts', postId));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('Error fetching forum post:', error);
    throw error;
  }
};

export const getPostComments = async (postId) => {
  try {
    const q = query(
      collection(db, 'forum_posts', postId, 'comments'),
      where('approved', '==', true),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
  } catch (error) {
    console.error('Error fetching comments:', error);
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
  } catch (error) {
    console.error('Error adding comment:', error);
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
  } catch (error) {
    console.error('Error toggling post upvote:', error);
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
  } catch (error) {
    console.error('Error toggling comment upvote:', error);
    throw error;
  }
};

export const getAnonName = () => {
  const existing = localStorage.getItem('anonName');
  if (existing) return existing;
  const newName = `Anon#${Math.floor(1000 + Math.random() * 9000)}`;
  localStorage.setItem('anonName', newName);
  return newName;
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
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
};

export const getJournalEntries = async (userId, monthKey) => {
  // monthKey format: 'YYYY-MM'
  try {
    // Simple query: get all entries for user, client-side filter by month if complex
    // Or better: Use string comparison on date field (YYYY-MM-DD startsWith YYYY-MM)
    const q = query(
      collection(db, 'journal_entries'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter for specific month if provided
    if (monthKey) {
      return all.filter(e => e.date.startsWith(monthKey));
    }
    return all;
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
};

export const getJournalEntry = async (userId, dateStr) => {
  try {
    const docId = `${userId}_${dateStr}`;
    const snap = await getDoc(doc(db, 'journal_entries', docId));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    throw error;
  }
};
