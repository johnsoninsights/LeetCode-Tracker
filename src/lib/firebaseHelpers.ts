import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Problem, Status } from '@/types';

const PROBLEMS_COLLECTION = 'problems';

// Add a new problem to Firestore (with userId)
export const addProblem = async (problem: Problem, userId: string) => {
  try {
    const problemData: any = {
      userId, // Add userId to associate with the user
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags,
      status: problem.status,
      createdAt: problem.createdAt.toISOString(),
    };

    if (problem.leetcodeNumber) {
      problemData.leetcodeNumber = problem.leetcodeNumber;
    }
    if (problem.url) {
      problemData.url = problem.url;
    }
    if (problem.lastAttemptedAt) {
      problemData.lastAttemptedAt = problem.lastAttemptedAt.toISOString();
    }

    const docRef = await addDoc(collection(db, PROBLEMS_COLLECTION), problemData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding problem:', error);
    throw error;
  }
};

// Get all problems for a specific user
export const getProblems = async (userId: string): Promise<Problem[]> => {
  try {
    const q = query(
      collection(db, PROBLEMS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const problems: Problem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      problems.push({
        id: doc.id,
        title: data.title,
        difficulty: data.difficulty,
        tags: data.tags,
        leetcodeNumber: data.leetcodeNumber,
        url: data.url,
        status: data.status,
        createdAt: new Date(data.createdAt),
        lastAttemptedAt: data.lastAttemptedAt ? new Date(data.lastAttemptedAt) : undefined,
      });
    });
    
    return problems;
  } catch (error) {
    console.error('Error getting problems:', error);
    throw error;
  }
};

// Update problem status
export const updateProblemStatus = async (problemId: string, newStatus: Status) => {
  try {
    const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
    await updateDoc(problemRef, {
      status: newStatus,
      lastAttemptedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating problem status:', error);
    throw error;
  }
};

// Delete a problem
export const deleteProblem = async (problemId: string) => {
  try {
    await deleteDoc(doc(db, PROBLEMS_COLLECTION, problemId));
  } catch (error) {
    console.error('Error deleting problem:', error);
    throw error;
  }
};