import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {OrdersContext} from '../contexts';

type OrdersProps = {};

export default function OrdersList(_: OrdersProps) {
    const [openOrder, setOpenOrder] = useState<string | undefined>('TommerID');
    const orders = useContext(OrdersContext);
    return (
        <>
            {Array.from(orders.keys()).map((order, index) => {
                return (
                    <TouchableOpacity
                        key={order.id}
                        onPress={() => {
                            setOpenOrder(
                                openOrder === order.id ? undefined : order.id,
                            );
                        }}>
                        <View
                            style={[
                                styles.orderContainer,
                                index % 2 === 0
                                    ? styles.background1
                                    : styles.background2,
                            ]}>
                            <Text>{order.id}</Text>
                            {openOrder === order.id && (
                                <Text>{order.items}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
    background1: {
        backgroundColor: '#f5dabc',
    },
    background2: {
        backgroundColor: '#bcd8f5',
    },
    orderContainer: {
        paddingHorizontal: 20,
        paddingVertical: 7,
    },
});
