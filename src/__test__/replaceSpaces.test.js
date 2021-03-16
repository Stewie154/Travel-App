import {replaceSpaces} from '../client/js/replaceSpaces'


test('replaces spaces with +', () => {
    const string = 'Hello World!';
    const testString = replaceSpaces(string)
    replaceSpaces(string);
    expect(testString).toBe('Hello+World!')
})