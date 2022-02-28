import React from 'react';
import {TextInput, Button, SafeAreaView} from 'react-native';
import {useState} from 'react';
import { MainPageViewController } from '../ViewController/MainPageViewController';
import { LoginPageViewController } from '../ViewController/LoginPageViewController';

type BaseProps = {
    connected: boolean
}

export const BasePage = (props: BaseProps) => {

	return (props.connected ? (<MainPageViewController />) : (<LoginPageViewController/>));
};
