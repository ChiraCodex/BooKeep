import { useOAuth, useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {useState} from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from '@/assets/styles/auth.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/assets/constants/colors'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("")

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
  } catch (err: any) {
      if(err.errors?.[0]?.code === 'form_password_incorrect') {
          setError('Incorrect password. Please try again.');
      } else {
          setError('An error occurred. Please try again.');
      }
  }
  }

   // Google sign-in handler
  const onGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setOAuthActive?.({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };


  return (
    <KeyboardAwareScrollView
    style={{flex: 1}}
    contentContainerStyle={{flexGrow: 1}}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraHeight={100}>
      <View style={styles.container}>
        <Image source={require('../../assets/images/budget.png')} style={styles.illustration}/>
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={()=> setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight}/> 
            </TouchableOpacity>
          </View>
        ) : null}
      
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor= '#9a8478'
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
         style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor= '#9a8478'
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
         <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText} >Login</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer} >
         <Text style={{textAlign: 'center', fontSize: 18}} >or</Text>
           {/* Continue with Google button */}
        
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: '#cec288',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            },
          ]}
          onPress={onGoogleSignIn}
        >
          <Image
            source={require('../../assets/images/google.png')}            style={{ width: 24, height: 24, marginRight: 8 }}
            resizeMode="contain"
          />
          <View>
            <Text className="font-bold">Continue with Google</Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
           <Text style={styles.footerText}>Get Started?</Text>
          <Link href={'/sign-up'} asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
         </View>
      </View>
    </KeyboardAwareScrollView>
  )
}