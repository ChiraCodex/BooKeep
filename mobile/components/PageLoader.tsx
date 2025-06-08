import { COLORS } from "@/assets/constants/colors"
import { styles } from "@/assets/styles/home.styles"
import { ActivityIndicator, View } from "react-native"

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='small' color={COLORS.primary} />
    </View>
  )
}
export default PageLoader;