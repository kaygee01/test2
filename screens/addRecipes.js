import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getAuth } from 'firebase/auth';
import { addRecipe, updateRecipe } from '../services/dbactions'; // Replace with your actual functions
import CustomBorderBtn from './components/CustomBorderBtn';
import CustomSolidBtn from './components/CustomSolidBtn';
import CustomTextInput from './components/CustomTextInput';
import { db, auth } from '../services/Fbconfig';

const RecipeForm = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [preparationSteps, setPreparationSteps] = useState(['']); 
  const [cookingTime, setCookingTime] = useState('');
  const [image, setImage] = useState(null); // Image from the device
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isEdit = route.params?.edit;
  const recipe = route.params?.recipe;
  const uid = route.params?.uid;
  //console.log(isEdit);
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setCurrentUserUid(user.uid);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    if (isEdit && recipe) {
      setName(recipe.name);
      setIngredients(recipe.ingredients.split(',')); 
      setPreparationSteps(recipe.preparationSteps.split(','));
      setCookingTime(recipe.cookingTime);
      setImage(recipe.image);
    }
  }, [isEdit, recipe]);

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri); // Set image URI to state
      }
    });
  };

  const saveRecipe = async () => {
    if (isEdit && (!currentUserUid || currentUserUid !== uid)) {
      alert("You are not authorized to modify this recipe.");
      return;
    }

    if (name && ingredients.length > 0 && preparationSteps.length > 0 && cookingTime) {
      const recipeData = {
        name,
        ingredients: ingredients.join(','), 
        preparationSteps: preparationSteps.join(','),
        cookingTime,
        image,
        uid: currentUserUid,
      };

      try {
        if (isEdit) {
          await updateRecipe(recipe.id, recipeData);
        } else {
          await addRecipe(recipeData);
        }
        navigation.goBack();
      } catch (error) {
        alert('Error saving recipe: ' + error.message);
      }
    } else {
      alert('All fields must be filled.');
    }
  };

  const addField = (setState, state) => {
    setState([...state, '']); // Add an empty string for a new input
  };

  const handleChange = (index, value, setState, state) => {
    const newArray = [...state];
    newArray[index] = value;
    setState(newArray);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEdit ? "Edit Recipe" : "Create Recipe"}</Text>

      {isAuthenticated ? (
        <Text style={styles.authStatus}>You are authenticated</Text>
      ) : (
        <Text style={styles.authStatus}>You are not authenticated</Text>
      )}

      <CustomTextInput
        title="Recipe Title"
        placeholder="Enter recipe title"
        value={name}
        onChangeText={setName}
        inputStyle={styles.input}
      />

      <Text style={styles.subTitle}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <CustomTextInput
          key={index}
          title={`Ingredient ${index + 1}`}
          placeholder={`Enter ingredient ${index + 1}`}
          value={ingredient}
          onChangeText={(value) => handleChange(index, value, setIngredients, ingredients)}
          inputStyle={styles.input}
        />
      ))}
      <TouchableOpacity onPress={() => addField(setIngredients, ingredients)} style={styles.addTaskButton}>
        <Text style={styles.addTaskText}>+ Add Ingredient</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Preparation Steps</Text>
      {preparationSteps.map((step, index) => (
        <CustomTextInput
          key={index}
          title={`Step ${index + 1}`}
          placeholder={`Enter step ${index + 1}`}
          value={step}
          onChangeText={(value) => handleChange(index, value, setPreparationSteps, preparationSteps)}
          inputStyle={styles.input}
        />
      ))}
      <TouchableOpacity onPress={() => addField(setPreparationSteps, preparationSteps)} style={styles.addTaskButton}>
        <Text style={styles.addTaskText}>+ Add Step</Text>
      </TouchableOpacity>

      <CustomTextInput
        title="Cooking Time"
        placeholder="Enter cooking time (e.g. 30 mins)"
        value={cookingTime}
        onChangeText={setCookingTime}
        inputStyle={styles.input}
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <View style={styles.buttonContainer}>
        <CustomSolidBtn
          title={isEdit ? "Update Recipe" : "Save Recipe"}
          onClick={saveRecipe}
        />
        <CustomBorderBtn title="Cancel" onClick={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
  addTaskButton: {
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addTaskText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#ff7043',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default RecipeForm;
