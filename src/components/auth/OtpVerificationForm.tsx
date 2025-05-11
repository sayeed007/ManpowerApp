import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import Button from '../common/Button';
import LoadingIndicator from '../common/LoadingIndicator';

type OtpVerificationFormProps = {
  onSubmit: (otp: string) => void;
  onResendCode: () => void;
  loading: boolean;
  email: string;
};

const OTP_LENGTH = 6;

const OtpVerificationForm = ({
  onSubmit,
  onResendCode,
  loading,
  email,
}: OtpVerificationFormProps) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      onResendCode();
      setTimer(60);
      setCanResend(false);
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === OTP_LENGTH) {
      onSubmit(otpString);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <Text style={styles.message}>
        We've sent a verification code to{' '}
        <Text style={styles.email}>{email}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {Array(OTP_LENGTH)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={index}
              ref={ref => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              value={otp[index]}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
          <Text
            style={
              canResend ? styles.resendButton : styles.resendButtonDisabled
            }>
            {canResend ? 'Resend' : `Resend in ${timer}s`}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <Button
          title="Verify"
          onPress={handleSubmit}
          style={styles.button}
          disabled={otp.join('').length !== OTP_LENGTH}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
  },
  message: {
    color: COLORS.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  email: {
    fontWeight: '700',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  resendContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  resendText: {
    color: COLORS.text,
  },
  resendButton: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  resendButtonDisabled: {
    color: COLORS.textLight,
    fontWeight: '700',
  },
  button: {
    width: '100%',
  },
});

export default OtpVerificationForm;
