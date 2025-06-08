import { COLORS } from "@/assets/constants/colors";
import { formatDate } from "@/assets/lib/utils";
import { styles } from "@/assets/styles/home.styles";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "bus",
  Communication: 'call',
  Entertainment: "film",
  Housing: 'cube',
  Investment: 'bar-chart',
  Bills: "receipt",
  Income: "cash",
  Other: "ellipsis-horizontal",
  Medication: 'medical-sharp'
};

interface TransactionItemProps {
  item: {
    id: string;
    amount: number;
    category: keyof typeof CATEGORY_ICONS;
    title: string;
    created_at: string;
  };
  onDelete: (id: string) => void;
}

export const TransactionItem = ({ item, onDelete }: TransactionItemProps) => {
  const isIncome = item.amount > 0;
  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

  return (
    <View style={styles.transactionCard} key={item.id}>
      <TouchableOpacity style={styles.transactionContent}>
        
         <Ionicons
          name= {iconName}
          size={24}
          color={isIncome ? COLORS.income : COLORS.expense}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          
        </View>
       <View style={{display: 'flex', alignItems: 'flex-end', paddingInline: 16}}>
         <Text
          style={[
            styles.transactionAmount,
            { color: isIncome ? COLORS.income : COLORS.expense }
          ]}
        >
          {isIncome ? "" : ""}Ksh {Math.abs(item.amount).toFixed(2)}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
       </View>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Ionicons name="trash" size={20} color={COLORS.expense} />
        </TouchableOpacity>
      </TouchableOpacity>
      
    </View>
  );
};

