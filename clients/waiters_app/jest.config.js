module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-native' +
            '|react-native-raw-bottom-sheet' +
            '|@react-native' +
            '|react-native-geolocation-service' +
            ')/)',
    ],
};
