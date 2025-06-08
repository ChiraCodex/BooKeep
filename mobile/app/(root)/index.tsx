import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import {  useRouter } from 'expo-router'
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions'
import { useEffect, useState } from 'react'
import { styles } from '@/assets/styles/home.styles'
import PageLoader from '@/components/PageLoader'
import { Ionicons } from '@expo/vector-icons'
import BalanceCard from '@/app/BalanceCard'
import { TransactionItem } from '@/components/TransactionItem'
import NoTransactionsFound from '@/components/NoTransactionsFound'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user?.id ?? '');

  useEffect(() => {
    loadData();
  }, [loadData])

  console.log('userId:',user?.id)
  console.log('transactions:', transactions);
  console.log('summary:',summary);

  const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
      setRefreshing(true)
      await loadData()
      setRefreshing(false)
    }

    const handleDelete = (id: string) => {
      Alert.alert('Delete Transaction', "Are you sure You want to delete this transaction?",[
        {text: "cancel", style: 'cancel'},
        {text: "Delete", style: "destructive", onPress: () => deleteTransaction(id)}
      ])
    }

    if (isLoading && !refreshing) return <PageLoader />;
    
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/*left */}
          <View style={styles.headerLeft}>
            <Image source={require("@/assets/images/receipt.png")} style={styles.headerLogo} resizeMode='contain'/>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>{user ?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
            </View>
          </View>
          {/*right */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={()=> router.push("/create")}>
              <Ionicons name='add' size={20} color='#fff'/>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton/>
          </View>
        </View>

        <BalanceCard summary={summary}/>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>
      
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound/>}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}