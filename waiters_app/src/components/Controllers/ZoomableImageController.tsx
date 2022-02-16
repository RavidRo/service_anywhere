import React, {useCallback, useEffect, useState} from 'react';
import {
	PanResponder,
	StyleProp,
	ViewStyle,
	NativeTouchEvent,
} from 'react-native';
import {PointMarker} from '../../map';
import ZoomableImageView from '../Views/ZoomableImageView';

function calcDistance(x1: number, y1: number, x2: number, y2: number) {
	const dx = x1 - x2;
	const dy = y1 - y2;
	return Math.sqrt(dx ** 2 + dy ** 2);
}

// function calcCenter(x1: number, y1: number, x2: number, y2: number) {
//     return {
//         x: (x1 + x2) / 2,
//         y: (y1 + y2) / 2,
//     };
// }

type MyZoomableImageProps = {
	imageWidth: number;
	imageHeight: number;
	parentWidth: number;
	parentHeight: number;
	url: string;
	style?: StyleProp<ViewStyle>;
	pointsOfInterest: PointMarker[];
};
const MAX_ZOOM = 3.5;

export default function MyZoomableImage({
	imageWidth,
	imageHeight,
	parentWidth,
	parentHeight,
	style,
	url,
	pointsOfInterest = [],
}: MyZoomableImageProps) {
	const [top, setTop] = useState<number>(0);
	const [left, setLeft] = useState<number>(0);
	const [zoom, setZoom] = useState<number>(1);

	const [lastDistance, setLastDistance] = useState<number | undefined>();
	const [lastX, setLastX] = useState<number | undefined>();
	const [lastY, setLastY] = useState<number | undefined>();

	const [minZoom, setMinZoom] = useState<number>(0);

	const [lastTouchNum, setLastTouchNum] = useState<number>(0);

	const safeSetTop = useCallback(
		(set: (top: number) => number) => {
			setTop(top => {
				let newTop = set(top);
				newTop = Math.min(0, newTop);
				newTop = Math.max(parentHeight - imageHeight * zoom, newTop);
				return newTop;
			});
		},
		[imageHeight, zoom, parentHeight]
	);

	const safeSetLeft = useCallback(
		(set: (left: number) => number) => {
			setLeft(left => {
				let newLeft = set(left);
				newLeft = Math.min(0, newLeft);
				newLeft = Math.max(parentWidth - imageWidth * zoom, newLeft);
				return newLeft;
			});
		},
		[imageWidth, zoom, parentWidth]
	);

	useEffect(() => {
		// imageHeight * zoom >= dimension.height -> zoom >= dimensions.height/imageHeight
		// imageWidth * zoom >= dimension.width -> zoom >= dimensions.width/imageWidth
		const minZoomHeight = parentHeight / imageHeight;
		const minZoomWidth = parentWidth / imageWidth;
		const minZoom = Math.max(minZoomHeight, minZoomWidth);
		setMinZoom(minZoom);
		setZoom(minZoom);
	}, [imageHeight, imageWidth, parentHeight, parentWidth]);

	function processPinch(touch1: NativeTouchEvent, touch2: NativeTouchEvent) {
		const {pageX: x1, pageY: y1} = touch1;
		const {pageX: x2, pageY: y2} = touch2;

		const distance = calcDistance(x1, y1, x2, y2);

		if (lastDistance) {
			const touchZoom = distance / lastDistance;
			const newZoom = Math.max(
				Math.min(zoom * touchZoom, MAX_ZOOM),
				minZoom
			);
			setZoom(newZoom);
			safeSetLeft(left => left + (imageWidth * (zoom - newZoom)) / 2);
			safeSetTop(top => top + (imageHeight * (zoom - newZoom)) / 2);
		}
		setLastDistance(distance);
	}
	function processTouch(moveX: number, moveY: number) {
		if (lastX && lastY) {
			safeSetTop(top => top + moveY - lastY);
			safeSetLeft(left => left + moveX - lastX);
		}
		setLastX(moveX);
		setLastY(moveY);
	}

	const panResponder = PanResponder.create({
		// Ask to be the responder:
		onStartShouldSetPanResponder: (_evt, _gestureState) => true,
		onStartShouldSetPanResponderCapture: (_evt, _gestureState) => true,
		onMoveShouldSetPanResponder: (_evt, _gestureState) => true,
		onMoveShouldSetPanResponderCapture: (_evt, _gestureState) => true,

		onPanResponderGrant: (_evt, _gestureState) => {
			// The gesture has started. Show visual feedback so the user knows
			// what is happening!
			// gestureState.d{x,y} will be set to zero now
		},
		onPanResponderMove: (evt, gestureState) => {
			// The most recent move distance is gestureState.move{X,Y}
			// The accumulated gesture distance since becoming responder is
			// gestureState.d{x,y}
			if (lastTouchNum !== gestureState.numberActiveTouches) {
				setLastDistance(undefined);
				setLastX(undefined);
				setLastY(undefined);
			}
			setLastTouchNum(gestureState.numberActiveTouches);

			if (gestureState.numberActiveTouches === 2) {
				processPinch(
					evt.nativeEvent.touches[0],
					evt.nativeEvent.touches[1]
				);
			} else if (gestureState.numberActiveTouches === 1) {
				processTouch(gestureState.moveX, gestureState.moveY);
			}
		},
		onPanResponderTerminationRequest: (_evt, _gestureState) => true,
		onPanResponderRelease: (_evt, _gestureState) => {
			// The user has released all touches while this view is the
			// responder. This typically means a gesture has succeeded
			setLastDistance(undefined);
			setLastX(undefined);
			setLastY(undefined);
			setLastTouchNum(0);
		},
		onPanResponderTerminate: (_evt, _gestureState) => {
			// Another component has become the responder, so this gesture
			// should be cancelled
		},
		onShouldBlockNativeResponder: (_evt, _gestureState) => {
			// Returns whether this component should block native components from becoming the JS
			// responder. Returns true by default. Is currently only supported on android.
			return true;
		},
	});

	const props = {
		style,
		panHandlers: panResponder.panHandlers,
		pointsOfInterest,
		imageURL: url,
		zoom,
		imageHeight,
		imageWidth,
		top,
		left,
	};
	return <ZoomableImageView {...props} />;
}
