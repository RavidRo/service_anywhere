import React from 'react';
import {TextInput, Button, SafeAreaView} from 'react-native';
import {useState} from 'react';

export const LoginPage = (props: any) => {
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');

	return (
		<SafeAreaView>
			<TextInput
				onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
			/>
			<TextInput
				secureTextEntry={true}
				onChangeText={password => setPassword(password)}
			/>
			<Button title='Login' onPress={props.Login()} />
		</SafeAreaView>
	);
};
