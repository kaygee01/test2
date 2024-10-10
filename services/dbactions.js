import { db } from './Fbconfig';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, getDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchRecipes = async (uid) => {
    const recipesCollection = collection(db, 'recipes');
    const q = query(recipesCollection, where('uid', '==', uid));
    const recipeSnapshot = await getDocs(q);
    return recipeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addRecipe = async (recipeData) => {
  try {
    const docRef = await addDoc(collection(db, 'recipes'), recipeData);
    const newRecipeWithId = {
        ...recipeData,
        id: docRef.id,
      };
    console.log(newRecipeWithId);
    return newRecipeWithId;
  } catch (error) {
    console.error("Error adding recipe: ", error);
    await saveRecipeLocally(recipeData);
    throw error; // Rethrow the error for handling
  }
};

export const updateRecipe = async (id, updatedData) => {
  try {
    const recipeDoc = doc(db, 'recipes', id);
    await updateDoc(recipeDoc, updatedData);
  } catch (error) {
    console.error("Error updating recipe: ", error);
    await saveRecipeLocally(recipeData);
    throw error;
  }
};

export const fetchUserFirstName = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.firstName ;
      } else {
        console.error('No such user document!');
        return 'User';
      }
    } catch (error) {
      console.error("Error fetching user first name: ", error);
      throw error;
    }
  };

  const saveRecipeLocally = async (recipeData) => {
    try {
      const existingRecipes = await AsyncStorage.getItem('offlineRecipes');
      const recipes = existingRecipes ? JSON.parse(existingRecipes) : [];
      recipes.push(recipeData); // Add the new recipe to the array
      await AsyncStorage.setItem('offlineRecipes', JSON.stringify(recipes));
    } catch (error) {
      console.error("Error saving recipe locally: ", error);
    }
  };