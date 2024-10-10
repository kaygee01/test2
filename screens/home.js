import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
//import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getAuth } from 'firebase/auth';
import { fetchRecipes, fetchUserFirstName } from '../services/dbactions';
import { db, auth } from '../services/Fbconfig';


const Home = ({ navigation, route }) => {
  const [recipes, setRecipes] = useState([]);
  const [userName, setUserName] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [newRecipe, setNewRecipe] = useState({ title: '', description: '' }); // New recipe state
  const { uid } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const user = getAuth().currentUser;
      if (!user) {
        console.error('User is not authenticated');
        //console.log(uid);
        return;
      }
      //console.log(user);
      

      try {
        const firstName = await fetchUserFirstName(user.uid);
        setUserName(firstName);
        const fetchedRecipes = await fetchRecipes(uid);
        setRecipes(fetchedRecipes); // Update the state with fetched recipes
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    fetchData();
  }, [uid, refresh]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRefresh(prev => !prev); // Trigger refresh when the screen is focused
    });

    return unsubscribe;
  }, [navigation]);


  const renderRecipe = ({ item }) => (
    <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Image 
            source={{ uri: item.image }} 
            style={styles.recipeImage}
            resizeMode="cover" 
        />

        <View style={styles.ingredientsContainer}>
        <Text style={styles.heading}>Ingredients:</Text>
        {item.ingredients ? (
            item.ingredients.split(',').map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                    <Icon name="check-circle" size={20} color="#f4511e" />
                    <Text style={styles.taskText}>{ingredient.trim()}</Text>
                </View>
            ))
        ) : (
            <Text>No ingredients available</Text>
        )}
    </View>


    {/* Preparation Steps Section */}
    <Text style={styles.heading}>Preparation Steps:</Text>
        {item.preparationSteps ? item.preparationSteps.split(',').map((step, index) => (
            <Text key={index} style={styles.stepsList}>
                {index + 1}. {step.trim()}
            </Text>
        )) : <Text>No preparation steps available</Text>}

        <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => navigation.navigate('recipeMod', { recipe: item, edit: true , uid })}
            >
            <Text style={styles.completeButtonText}>Update Recipe</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            <Icon name="user" size={20} color="#000" />
            <Text style={styles.userName}>{`Hello, ${userName}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('recipeMod', { uid })} style={styles.addButton}>
          <Icon name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Recipes</Text>
      
      {/* Input Fields for New Recipe */}
      

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recipesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'black',
    marginLeft: 7,
  },
  addButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  recipesList: {
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 4,
    color: "#000"
  },
  ingredientsContainer: {
    marginBottom: 8,
  },
  ingredientItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 1,
    flexDirection: "row",
    paddingLeft: 5
  },
  taskText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  stepsList: {
    fontSize: 14,
    color: '#555',
    paddingLeft: 5
  },
  completeButton: {
    backgroundColor: '#f4511e',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',          
    height: 150,           
    borderRadius: 8,       
    marginBottom: 10,      
  },
});

export default Home;
