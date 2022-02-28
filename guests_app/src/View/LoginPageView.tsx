import React from 'react';
import {TextInput, Button, SafeAreaView} from 'react-native';
import {useState} from 'react';

export const LoginPage = (props: any) => {
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
