import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService, UserService, TokenManager, UserManager } from '../services';

/**
 * Debug Screen
 * Use this screen to test API calls and debug issues
 */
const DebugScreen: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testGetUserMe = async () => {
    try {
      addLog('🧪 Testing GET /user/me...');
      const user = await UserService.getMe();
      
      if (user) {
        addLog(`✅ Success: ${user.name} (${user.email})`);
        Alert.alert('Success', `User: ${user.name}`);
      } else {
        addLog('❌ Failed: User is null');
        Alert.alert('Failed', 'User is null');
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  const testFetchUserDetails = async () => {
    try {
      addLog('🧪 Testing AuthService.fetchUserDetails()...');
      const user = await AuthService.fetchUserDetails();
      
      if (user) {
        addLog(`✅ Success: ${user.name} (${user.email})`);
        Alert.alert('Success', `User: ${user.name}`);
      } else {
        addLog('❌ Failed: User is null');
        Alert.alert('Failed', 'User is null');
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  const testValidateSession = async () => {
    try {
      addLog('🧪 Testing AuthService.validateSession()...');
      const isValid = await AuthService.validateSession();
      
      addLog(`Result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      Alert.alert('Session Status', isValid ? 'Valid' : 'Invalid');
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  const checkTokenStatus = async () => {
    try {
      addLog('🧪 Checking token status...');
      
      const accessToken = await TokenManager.getAccessToken();
      const refreshToken = await TokenManager.getRefreshToken();
      
      if (accessToken) {
        const isExpired = TokenManager.isTokenExpired(accessToken);
        addLog(`Access Token: ${accessToken.substring(0, 20)}...`);
        addLog(`Is Expired: ${isExpired ? '❌ Yes' : '✅ No'}`);
      } else {
        addLog('❌ No access token found');
      }
      
      if (refreshToken) {
        addLog(`Refresh Token: ${refreshToken.substring(0, 20)}...`);
      } else {
        addLog('❌ No refresh token found');
      }
      
      Alert.alert('Token Status', 'Check logs for details');
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  const clearAllTokens = async () => {
    Alert.alert(
      'Clear Tokens',
      'This will log you out. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              addLog('🧪 Clearing all tokens...');
              await TokenManager.clearTokens();
              await UserManager.clearUser();
              addLog('✅ Tokens cleared');
              Alert.alert('Success', 'Tokens cleared. Restart app to login again.');
            } catch (error: any) {
              addLog(`❌ Error: ${error.message}`);
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const testRefreshToken = async () => {
    try {
      addLog('🧪 Testing token refresh...');
      const newToken = await AuthService.refreshToken();
      
      addLog(`✅ Success: ${newToken.substring(0, 20)}...`);
      Alert.alert('Success', 'Token refreshed');
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Debug Tools</Text>
        <TouchableOpacity onPress={clearLogs} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={testGetUserMe}>
          <Text style={styles.buttonText}>Test GET /user/me</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testFetchUserDetails}>
          <Text style={styles.buttonText}>Test Fetch User Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testValidateSession}>
          <Text style={styles.buttonText}>Test Validate Session</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={checkTokenStatus}>
          <Text style={styles.buttonText}>Check Token Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testRefreshToken}>
          <Text style={styles.buttonText}>Test Refresh Token</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearAllTokens}>
          <Text style={styles.buttonText}>Clear All Tokens</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Logs:</Text>
        <ScrollView style={styles.logsScroll}>
          {logs.length === 0 ? (
            <Text style={styles.noLogs}>No logs yet. Tap a button to test.</Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonsContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logsContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    margin: 16,
    borderRadius: 8,
    padding: 12,
  },
  logsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logsScroll: {
    flex: 1,
  },
  logText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  noLogs: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default DebugScreen;
