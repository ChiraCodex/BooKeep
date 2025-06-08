import {useState} from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useOAuth, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { styles } from '@/assets/styles/auth.styles'
import { COLORS } from '@/assets/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
   const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState("")

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err: any) {
       if(err.errors?.[0]?.code === 'form_identifier_exists') {
          setError('That email is already in use. Please try another.');
      } else {
          setError('An error occurred. Please try again.');
      }
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={()=> setError("")}>
                 <Ionicons name="close" size={20} color={COLORS.textLight}/> 
                </TouchableOpacity>
              
            </View>
          ): null}

        <TextInput
        style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor='#948478'
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button} >
          <Text style={styles.buttonText} >Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const onGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setOAuthActive?.({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      setError('Google sign-up failed. Please try again.');
    }
  };

  function onPressVerify(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.')
  }

  return (
    <><KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={100}>
      <View style={styles.container}>
        <Image source={require("../../assets/images/ewallet.png")} style={styles.illustration} />
        <Text style={styles.header}>BooKeep</Text>
        <Text style={styles.title}>Create Account</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor='#9a8478'
          onChangeText={(email) => setEmailAddress(email)} />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor='#9a8478'
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)} />
        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={{textAlign: 'center'}}>or</Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: 'green',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            },
          ]}
          onPress={onGoogleSignUp}
        >
          <Image
            source={require('../../assets/images/google.png')}
            style={{ width: 24, height: 24, marginRight: 8 }}
            resizeMode="contain" />
          <View>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>Continue with Google</Text>
          </View>
        </TouchableOpacity>


        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an Account?</Text>
          <Link href={'/sign-in'} asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </Link>

        </View>
      

      {pendingVerification && (
        <>
          <TextInput
            style={[styles.verificationInput, error && styles.errorInput]}
            placeholder="Enter email code"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode} />
          <TouchableOpacity onPress={onPressVerify} style={styles.button}>
            <Text style={styles.buttonText}>Verify Email</Text>
          </TouchableOpacity>
        </>
      )}
      </View>
    </KeyboardAwareScrollView>
  </>
  )
}