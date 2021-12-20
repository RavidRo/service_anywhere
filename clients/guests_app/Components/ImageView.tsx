import React from 'react';
import {Image, ImageSourcePropType, Text} from 'react-native';

type ImageView_Props = {
    image: ImageSourcePropType;
    title: String;
};

const ImageView: React.FC<ImageView_Props> = props => {
    return (
        <>
            <Text>{props.title}</Text>
            <Image source={props.image} resizeMode="contain" />
        </>
    );
};

export default ImageView;
