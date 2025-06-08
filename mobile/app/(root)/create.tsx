import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { styles } from '@/assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/assets/constants/colors'
import { API_URL } from '@/assets/constants/api'

const CATEGORIES = [
  {id: 'food', name: 'Food & Drinks', icon: 'fast-food'},
  {id: 'shopping', name: 'Shopping', icon: 'cart'},
  {id: 'communication', name: 'Communication', icon: 'call'},
  {id: 'entertainment', name: 'Entertainment', icon: 'film'},
  {id: 'housing', name: 'Housing', icon: 'cube'},
  {id: 'investment', name: 'Investment', icon: 'bar-chart'},
  {id: 'bills', name: 'Bills', icon: 'receipt'},
  {id: 'income', name: 'Income', icon: 'cash'},
  {id: 'other', name: 'Other', icon: 'ellipsis-horizontal'},
  {id: 'medication', name: 'Medication', icon: 'medical-sharp'},
  {id: 'transportation', name: 'Transportation', icon: 'bus'}
]

const create = () => {
  const router = useRouter();
  const {user} = useUser();

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isExpense, setIsExpense] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const hadleCreate =async () =>{
    //validations
    if(!title.trim()) return Alert.alert("Error", "Please Enter a Title");
    if(!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 ) {
      Alert.alert("Error", "Please Enter a Valid amount");
      return;
    }
    if(!selectedCategory) return Alert.alert("Error","Please select a Category");

    try {
      //formatting amount (-ve for expenses)
      const formattedAmount = isExpense
      ? -Math.abs(parseFloat(amount))
      : Math.abs(parseFloat(amount))

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: user?.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
        })
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create Transaction");
      }
      Alert.alert("Success", "Transaction created Successfully");
      router.back();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create Transaction";
      Alert.alert("Error", errorMessage);
      console.error("Error creating transaction:", error)
      
    } finally {
      setIsLoading(false)
    }
  }
  
  
  
  
  return (
    <><View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]} onPress={hadleCreate}
          disabled={isLoading}>
          <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
          {!isLoading && <Ionicons name='checkmark' size={18} color={COLORS.primary} />}
        </TouchableOpacity>
      </View>
    </View><View style={styles.card}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              isExpense && styles.typeButtonActive // Highlight if Expense is selected
            ]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name='arrow-up-circle'
              size={22}
              color={isExpense ? COLORS.expense : COLORS.expense
                
              }
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.typeButtonText,
                isExpense && styles.typeButtonTextActive
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              !isExpense && styles.typeButtonActive // Highlight if Income is selected
            ]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name='arrow-down-circle'
              size={22}
              color={!isExpense ? COLORS.income : COLORS.textLight}
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.typeButtonText,
                !isExpense && styles.typeButtonTextActive
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <Text style= {styles.currencySymbol}>Ksh.</Text>
          <TextInput
          style={styles.amountInput}
          placeholder='0.00'
          placeholderTextColor={COLORS.textLight}
          value={amount}
          onChangeText={setAmount}
          keyboardType='numeric'/>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
          name='create-outline'
          size={22}
          color={COLORS.textLight}
          style={styles.inputIcon}/>
          <TextInput
          style={styles.input}
          placeholder='Transaction Title'
          placeholderTextColor={COLORS.textLight}
          value={title}
          onChangeText={setTitle}/>
        </View>

        <Text style={styles.sectionTitle}>
          <Ionicons
          name='pricetag-outline'
          size={16}
          color={COLORS.text}/>Category
        </Text>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.name)}>
              <Ionicons
              name={category.icon}
              size={20}
              color={selectedCategory === category.name ? COLORS.white : COLORS.text}
              style ={styles.categoryIcon}/>
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.name && styles.categoryButtonTextActive
              ]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='small' color={COLORS.primary}/></View>
        )}
      </View></>
  )
}

export default create