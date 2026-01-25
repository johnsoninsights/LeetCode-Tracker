import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Problem, Status } from '@/types';

const PROBLEMS_COLLECTION = 'problems';

export const addProblem = async (problem: Problem, userId: string) => {
  try {
    const problemData: any = {
      userId,
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
    if (problem.notes) {
      problemData.notes = problem.notes;
    }

    const docRef = await addDoc(collection(db, PROBLEMS_COLLECTION), problemData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding problem:', error);
    throw error;
  }
};

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
        notes: data.notes,
      });
    });
    
    return problems;
  } catch (error) {
    console.error('Error getting problems:', error);
    throw error;
  }
};

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

export const updateProblemNotes = async (problemId: string, notes: string) => {
  try {
    const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
    await updateDoc(problemRef, {
      notes,
    });
  } catch (error) {
    console.error('Error updating problem notes:', error);
    throw error;
  }
};

export const deleteProblem = async (problemId: string) => {
  try {
    await deleteDoc(doc(db, PROBLEMS_COLLECTION, problemId));
  } catch (error) {
    console.error('Error deleting problem:', error);
    throw error;
  }
};