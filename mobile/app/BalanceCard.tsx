import { COLORS } from "@/assets/constants/colors"
import { styles } from "@/assets/styles/home.styles"
import { View, Text } from "react-native"

interface BalanceCardProps {
  summary: {
    balance: number;
    income: number;
    expenses: number;
  }
}

const BalanceCard = ({summary}: BalanceCardProps) => {
  const balance = typeof summary.balance === 'number' ? summary.balance : 0;
  const income = typeof summary.income === 'number' ? summary.income : 0;
  const expenses = typeof summary.expenses === 'number' ? summary.expenses : 0;

  return (
    <View style={styles.balanceCard}>
      <View>
        <Text style={styles.balanceTitle}>Total Balance</Text>
      <Text style={styles.balanceAmount}>Ksh{balance.toFixed(2)}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 80}}>
        <View>
          <Text style={{ color: COLORS.income }}>
           Income: 
        </Text>
        <Text>Ksh.  {income.toFixed(2)}</Text>
        </View>
       <View>
         <Text style={{ color: COLORS.expense }}>
          Expenses:  
        </Text>
        <Text>
          Ksh.  {Math.abs(expenses).toFixed(2)}
        </Text>
       </View>
      </View>

    </View>
  );
};

export default BalanceCard;