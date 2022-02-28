import React from 'react';
import {TextInput, Button, SafeAreaView} from 'react-native';

type LoginPageType = {
	setPhoneNumber: (newPhone: string) => void;
	setPassword: (newPassword: string) => void;
	Login: () => void;
};

export const LoginPage = (props: LoginPageType) => {
	return (
		<SafeAreaView>
			<TextInput
				onChangeText={phoneNumber => props.setPhoneNumber(phoneNumber)}
			/>
			<TextInput
				secureTextEntry={true}
				onChangeText={password => props.setPassword(password)}
			/>
			<Button title='Login' onPress={() => props.Login()} />
		</SafeAreaView>
	);
};
