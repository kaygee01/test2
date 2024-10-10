import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import CustomBorderBtn from './components/CustomBorderBtn';
import CustomSolidBtn from './components/CustomSolidBtn';
import CustomTextInput from './components/CustomTextInput';
import { useNavigation } from '@react-navigation/native';
//import { auth, db } from '../services/Fbconfig'; // Import your Firebase config
import { db, auth } from '../services/Fbconfig';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import { createUserWithEmailAndPassword } from 'firebase/auth';
import storage from '@react-native-firebase/storage';
import CustomPasswordInput from './components/CustomPasswordInput';

const Signup = () => {
    const navigation = useNavigation();
    const defRecipes = [
        {"name": "Veggie Stir-Fry", "ingredients": "Vegetables, oil, spices", "preparationSteps": "Fry vegetables in oil.", "cookingTime": "15 minutes", "image": require("./images/veggie-fry.webp")},
        {"name": "Margherita Pizza", "ingredients": "Pasta, tomato sauce", "preparationSteps": "Boil pasta and add sauce.", "cookingTime": "20 minutes", "image": require("./images/mar-pizza.jpg")},
        {"name": "Banana pancake", "ingredients": "Lettuce, tomatoes, dressing", "preparationSteps": "Mix all ingredients.", "cookingTime": "10 minutes", "image": require("./images/ban-pancake.jpg")}
    ];
    //const [imageUri, setImageUri] = useState(null);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const validate = () => {
        let valid = true;
        const newErrors = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmedEmail = form.email?.trim() || '';

        if (form.firstName.trim() === '') {
            newErrors.firstName = 'Please enter your first name';
            valid = false;
        }
        if (form.lastName.trim() === '') {
            newErrors.lastName = 'Please enter your last name';
            valid = false;
        }
        if (trimmedEmail === '') {
            newErrors.email = 'Please enter an email';
            valid = false;
        } else if (!emailRegex.test(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email';
            valid = false;
        }
        if (form.password === '') {
            newErrors.password = 'Please enter a password';
            valid = false;
        }
        if (form.confirmPassword === '') {
            newErrors.confirmPassword = 'Please confirm your password';
            valid = false;
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const uploadImage = async (uri) => {
        try {
            const reference = storage().ref(`recipe_images/${Date.now()}.jpg`);
            await reference.putFile(uri);
            return await reference.getDownloadURL();
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Image upload failed. Please try again.");
        }
    };
    

    const handleSignup = async () => {
        if (validate()) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
                const user = userCredential.user;
    
                // Create a user document in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    uid: user.uid
                });
    
                const recipesCollectionRef = collection(db, "recipes");
    
                
    
                setForm({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
    
                navigation.navigate("Home", { uid: user.uid });
            } catch (error) {
                console.error("Error signing up:", error);
                let errorMessage = 'An error occurred. Please try again.';
    
                // Update error messages based on the error code
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already in use.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 6 characters.';
                        break;
                    default:
                        errorMessage = error.message;
                        break;
                }
    
                setErrors(prevErrors => ({
                    ...prevErrors,
                    email: errorMessage
                }));
            }
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            {/* First Name Input */}
            <CustomTextInput
                value={form.firstName}
                onChangeText={txt => handleChange('firstName', txt)}
                title={"First Name"}
                placeholder={'John'}
                bad={errors.firstName !== ''}
            />
            {errors.firstName !== '' && <Text style={styles.errorMsg}>{errors.firstName}</Text>}

            {/* Last Name Input */}
            <CustomTextInput
                value={form.lastName}
                onChangeText={txt => handleChange('lastName', txt)}
                title={'Last Name'}
                placeholder={'Doe'}
                bad={errors.lastName !== ''}
            />
            {errors.lastName !== '' && <Text style={styles.errorMsg}>{errors.lastName}</Text>}

            {/* Email Input */}
            <CustomTextInput
                value={form.email}
                onChangeText={txt => handleChange('email', txt)}
                title={"Email"}
                placeholder={'xyz@gmail.com'}
                bad={errors.email !== ''}
            />
            {errors.email !== '' && <Text style={styles.errorMsg}>{errors.email}</Text>}

            {/* Password Input */}
            <CustomTextInput
                value={form.password}
                onChangeText={txt => handleChange('password', txt)}
                title={'Password'}
                placeholder={'********'}
                secureTextEntry={true}
                bad={errors.password !== ''}
            />
            {errors.password !== '' && <Text style={styles.errorMsg}>{errors.password}</Text>}

            {/* Confirm Password Input */}
            <CustomTextInput
                value={form.confirmPassword}
                onChangeText={txt => handleChange('confirmPassword', txt)}
                title={'Confirm Password'}
                placeholder={'********'}
                secureTextEntry={true}
                bad={errors.confirmPassword !== ''}
            />
            {errors.confirmPassword !== '' && <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <CustomSolidBtn
                    title={'Sign Up'}
                    onClick={handleSignup}
                />

                <CustomBorderBtn
                    title={'Already have an account? Login'}
                    onClick={() => navigation.navigate('Login')}
                />
            </View>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: moderateScale(20),
    },
    title: {
        fontWeight: '600',
        marginTop: moderateVerticalScale(50),
        alignSelf: 'center',
        fontSize: 25,
        color: "grey"
    },
    errorMsg: {
        alignSelf: "flex-start",
        marginLeft: moderateScale(25),
        color: "red",
        marginBottom: moderateVerticalScale(5),
    },
    buttonContainer: {
        marginTop: moderateVerticalScale(30),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
